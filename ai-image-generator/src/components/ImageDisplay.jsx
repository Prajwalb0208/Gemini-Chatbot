const ImageDisplay = ({ image, audio }) => {
    return (
        <div className="image-container">
            {image && <img src={image} alt="Generated" />}
            {audio && <audio controls src={audio}></audio>}
        </div>
    );
};

export default ImageDisplay;
