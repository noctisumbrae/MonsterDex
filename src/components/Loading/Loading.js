import "./Loading.css";

function Loading({ text = "Carregando..." }) {
  return (
    <div className="loading">
      <div className="loading-circle"></div>
      <p>{text}</p>
    </div>
  );
}

export default Loading;
