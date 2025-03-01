
import"./addOffer.css";

function unit_input(type,unit,message,name){
    return(
        <div className="unit-Input">
               <span className="unit">{unit}</span>
               <input className="textInput" type={type} placeholder={message} name={name} />
               </div>
    );
}
function AddOffer(props){

    return (
        <div className="page">
            <div className="add_offer">
            <form>
               <div className="group-input">
               <input className="textInput" type="text" placeholder="Enter offer title" name="offer title" />
               {unit_input("number","Dunums","Enter the number of dunums","size")}
               {unit_input("number","Years","Enter Rental Duration","duration")}
               {unit_input("text","JOD","Enter price","price")}
               <input className="textInput" type="text" placeholder="Enter offer location (e.g., Amman Sweileh) " name="location" />
               <textarea className="textInput" placeholder="Enter a detailed description of the land and the offer" rows="5" required></textarea>
               
               <label class="file-upload">
            Click here to upload images (you can select multiple images)
            <input type="file" multiple hidden  name="images"/>
        </label>

        <button type="submit" className="submit">Save and Publish</button>


               </div>
               </form>
               </div>
        </div>
    );
}
export default AddOffer;