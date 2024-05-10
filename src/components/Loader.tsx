import Loading from "../../public/assets/loader.gif";
const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-brown-950">
      <img src={Loading} alt="Loading..." />
    </div>
  );
};

export default Loader;
