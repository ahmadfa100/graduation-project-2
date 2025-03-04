import "../style/addOffer.css";

function UnitInput(props) {
  return (
    <div className="unit-Input">
      <span className="unit">{props.unit}</span>
      <input
        className="textInput composite"
        type={props.type}
        placeholder={props.message}
        name={props.name}
        max={props.max}
        min={props.min}
        required
      />
    </div>
  );
}

function Input(props) {
  return (
    <input
      className="textInput"
      type={props.type}
      placeholder={props.message}
      name={props.name}
      required
      min={props.min}
      max={props.max}
    />
  );
}

function AddOffer(props) {
  return (
    <div className="page">
      <div className="add_offer">
        <h3>land lease information</h3>
        <form>
          <div className="group-input">
            <Input type="text" message="Enter offer title" name="offer_title" />
            <UnitInput type="text" unit="m²" message="Enter the number of dunums" name="size" />
            {/* <UnitInput type="number" unit="Years" message="Enter Rental Duration" name="duration" /> */}
            <div className="detailed-input">
              <Input type="number" message="Lease duration(years)" name="years" min="0" max="100" />
              <Input type="number" message="Lease duration(months)" name="months" min="0" max="12"/>
            </div>
            <UnitInput type="text" unit="JOD" message="Enter price" name="price" />
            <Input
              type="text"
              message="Enter offer location (e.g., Amman Sweileh)"
              name="location"
            />
            <textarea
              className="textInput"
              placeholder="Enter a detailed description of the land and the offer"
              rows="5"
              required
            ></textarea>

            <div className="center">
              <label className="file-upload">
                Click here to upload images (you can select multiple images)
                <input type="file" multiple hidden name="images" />
              </label>

              <button type="submit" className="submit">
                Save and Publish
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOffer;
