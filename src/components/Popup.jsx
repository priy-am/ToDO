function Popup({ handleDeleteTrue, handleDeleteFalse }) {
  return (
    <div className="w-96 bg-[#bcd5f3a8] py-3 px-4 rounded-2xl fixed top-[40%] md:left-[40%]  left-2 ">
      <div className=" bg-[#3b4b547d] py-2 rounded-xl">
        <p className="text-center mb-4">You sure you wanna delete?</p>
        <div className="flex gap-4 items-center justify-center mb-2">
          <button
            onClick={handleDeleteFalse}
            className="bg-blue-950 text-white p-2 rounded-lg hover:font-bold w-32"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteTrue}
            className="bg-blue-950 text-white p-2 rounded-lg hover:font-bold w-32"
          >
            {" "}
            Confirm{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
