import { Command } from "commander";
import inquirer from "inquirer";
import { db, admin } from "./firebase.js";

const program = new Command();

program
  .command("add-order")
  .description("Add a new order to the database")
  .action(async () => {
    try {
      const productSnapshot = await db.collectionGroup("userProducts").get();
      const items = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        sellerId: doc.ref.parent.parent.id,
      }));
      const sellerIds = [...new Set(items.map((item) => item.sellerId))];
      const sellerDetails = await Promise.all(
        sellerIds.map(async (sellerId) => {
          try {
            const userRecord = await admin.auth().getUser(sellerId);
            return { id: sellerId, name: userRecord.displayName };
          } catch (error) {
            console.error(
              `Error fetching seller details for ${sellerId}:`,
              error
            );
            return { id: sellerId, name: "Unknown Seller" }; // Fallback in case of error
          }
        })
      );

      const { customerName } = await inquirer.prompt([
        {
          type: "input",
          name: "customerName",
          message: "Customer Name:",
        },
      ]);

      const { selectedSellerId } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedSellerId",
          message: "Select Seller:",
          choices: sellerDetails.map((seller) => ({
            name: `${seller.name} (${seller.id})`,
            value: seller.id,
          })),
        },
      ]);

      const sellerItems = items.filter(
        (item) => item.sellerId === selectedSellerId
      );

      const { selectedItems } = await inquirer.prompt([
        {
          type: "checkbox",
          name: "selectedItems",
          message: "Select Items:",
          choices: sellerItems.map((item) => ({
            name: item.name,
            value: item.id,
          })),
        },
      ]);

      const itemQuantities = await inquirer.prompt(
        selectedItems.map((itemId) => ({
          type: "number",
          name: itemId,
          message: `Quantity of ${
            sellerItems.find((item) => item.id === itemId)?.name
          }:`,
          validate: (value) => value > 0 || "Quantity must be greater than 0",
        }))
      );

      try {
        let orderRef;
        await db.runTransaction(async (transaction) => {
          const productRefs = selectedItems.map((itemId) =>
            db
              .collection("products")
              .doc(selectedSellerId)
              .collection("userProducts")
              .doc(itemId)
          );
          const productDocs = await Promise.all(
            productRefs.map((ref) => transaction.get(ref))
          );

          for (let i = 0; i < productDocs.length; i++) {
            const productDoc = productDocs[i];
            if (!productDoc.exists) {
              throw new Error(`Product with ID ${selectedItems[i]} not found.`);
            }
            const newQuantity =
              productDoc.data().quantity - itemQuantities[selectedItems[i]];
            if (newQuantity < 0) {
              throw new Error(
                `Insufficient stock for product ${selectedItems[i]}.`
              );
            }
          }

          const orderData = {
            customerName,
            sellerId: selectedSellerId,
            items: selectedItems,
            quantities: itemQuantities,
            timestamp: new Date(),
          };
          orderRef = db.collection("orders").doc();
          transaction.set(orderRef, orderData);

          for (let i = 0; i < productDocs.length; i++) {
            const productRef = productRefs[i];
            const newQuantity =
              productDocs[i].data().quantity - itemQuantities[selectedItems[i]];
            transaction.update(productRef, { quantity: newQuantity });
          }
        });

        console.log(`Order added with ID: ${orderRef.id}`);
      } catch (error) {
        console.error("Error processing order:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

program.parse(process.argv);
