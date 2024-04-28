import "../css/Error.css";

const Error = () => {
  return (
    <main className="login-main-bg">
      <div className="login-container">
        <div className="login-img">
          <img
            className="img-login"
            src="../public/assets/loginimg.png"
            alt="left img"
          />
        </div>
        <div className="login-form">
          <div className="logo-title">
            <img src="../public/assets/logo.png" alt="logo" />
            <span className="logo-title-campus">Campus</span>&nbsp;
            <span className="logo-title-eats">Eats</span>
          </div>

          <h1>Oops!</h1>

          <span className="span-subtitle">Panugo na ari!</span>
        </div>
      </div>
    </main>
  );
};

export default Error;
