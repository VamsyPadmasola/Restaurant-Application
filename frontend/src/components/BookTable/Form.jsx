
const Form = () => {
    return (<form action="/" className="form">
        <div class="elem-group">
            <label for="name">Your Name</label>
            <input className="p-2" type="text" id="name" name="visitor_name" placeholder="Enter Your Name" pattern="[A-Z\sa-z]{3,20}" required />
        </div>
        <div class="elem-group">
            <label for="email">Your E-mail</label>
            <input className="p-2" type="email" id="email" name="visitor_email" placeholder="abc@gmail.com" required />
        </div>
        <div class="elem-group">
            <label for="phone">Your Phone</label>
            <input className="p-2" type="tel" id="phone" name="visitor_phone" placeholder="Enter Your Phone No." required />
        </div>
        <hr />
        <div class="elem-group inlined">
            <label for="checkin-date"> Date of arrival</label>
            <input className="p-2" type="date" id="checkin-date" name="checkin" required />
        </div>
        <div class="elem-group inlined">
            <label for="checkout-date">Time Of Arrival</label>
            <input className="p-2" type="time" id="checkout-date" name="checkout" required />
        </div>
        <div class="elem-group">
            <label for="room-selection" class="pre">Select table Preference</label>
            <select className="p-2" id="room-selection" name="room_preference" required>
                <option value="">Choose a Table from the List</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
            </select>
        </div>
        <div className="flex items-center w-full justify-center">
            <button type="submit" id="sub" className="p-2">Reserve Table</button>
        </div>
    </form>);
};

export { Form };
