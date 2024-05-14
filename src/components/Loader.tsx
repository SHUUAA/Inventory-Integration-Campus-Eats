import Loading from "../assets/loader.gif";
const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-neutral-950">
      <img src={Loading} alt="Loading..." />
    </div>
  );
};

export default Loader;
