function showPlaces(){

    let output = `

        <h2>Accessible Places</h2>

        <input
            type="text"
            id="searchBox"
            placeholder="Search Location..."
            onkeyup="filterPlaces()"
        >

        <br><br>

        <div id="placesList"></div>

    `;

    document.getElementById("content").innerHTML = output;

    filterPlaces();

}

function filterPlaces(){

    let accessiblePlaces = [

        "Main Gate Ramp",

        "Library Elevator",

        "Accessible Washroom"

    ];

    let search = document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    let output = "<ul>";

    accessiblePlaces.forEach(place=>{

        if(place.toLowerCase().includes(search)){

            output += `<li>${place}</li>`;

        }

    });

    output += "</ul>";

    document.getElementById("placesList").innerHTML = output;

}

function requestAssistance() {

    let form = `
        <h2>Request Assistance</h2>

        <input type="text" id="name" placeholder="Enter your name">

        <br><br>

        <input type="text" id="location" placeholder="Current Location">

        <br><br>

        <input type="text" id="help" placeholder="Need Help With">

        <br><br>

        <button onclick="submitRequest()">
            Submit
        </button>
    `;

    document.getElementById("content").innerHTML = form;

}
function showEmergencyContacts() {

    let form = `

        <h2>Emergency Contact</h2>

        <input type="text" id="contactName" placeholder="Contact Name">

        <br><br>

        <input type="text" id="contactPhone" placeholder="Phone Number">

        <br><br>

        <button onclick="saveContact()">
            Save Contact
        </button>

    `;

    document.getElementById("content").innerHTML = form;

}

async function saveContact() {

    const contact = {

        name: document.getElementById("contactName").value,

        phone: document.getElementById("contactPhone").value

    };

    const response = await fetch("/contact", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(contact)

    });

    const data = await response.json();

    document.getElementById("content").innerHTML = `

        <h2>${data.message}</h2>

        <p><strong>Name:</strong> ${contact.name}</p>

        <p><strong>Phone:</strong> ${contact.phone}</p>

    `;

}

async function showMyRequests() {

    const response = await fetch("/requests");

    const requests = await response.json();

    let output = `
<h2>My Requests</h2>

<div class="stats-card">
    <h3>${requests.length}</h3>
    <p>Total Requests</p>
</div>
`;

    if(requests.length === 0){

        output += "<p>No requests found.</p>";

    }else{

        requests.forEach(request => {

            output += `

                <div class="request-card">

                    <h3>${request.name}</h3>

                    <p><strong>Location:</strong> ${request.location}</p>

                    <p><strong>Need Help:</strong> ${request.help}</p>

                    <button onclick="deleteRequest('${request._id}')">
                        🗑 Delete
                    </button>

                </div>

            `;

        });

    }

    document.getElementById("content").innerHTML = output;

}
async function submitRequest() {

    const request = {

        name: document.getElementById("name").value,

        location: document.getElementById("location").value,

        help: document.getElementById("help").value

    };

    const response = await fetch("/request", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(request)

    });

    const data = await response.json();

    document.getElementById("content").innerHTML = `

        <h2>${data.message}</h2>

        <p><strong>Name:</strong> ${request.name}</p>

        <p><strong>Location:</strong> ${request.location}</p>

        <p><strong>Help Needed:</strong> ${request.help}</p>

    `;

}
async function saveContact() {
    if (
    document.getElementById("contactName").value.trim() === "" ||
    document.getElementById("contactPhone").value.trim() === ""
) {
    alert("Please fill all fields.");
    return;
}

    let contact = {
        name: document.getElementById("contactName").value,
        phone: document.getElementById("contactPhone").value
    };

    await fetch("/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contact)
    });

    document.getElementById("content").innerHTML = `
        <h2>Contact Saved Successfully!</h2>

        <p><strong>Name:</strong> ${contact.name}</p>

        <p><strong>Phone:</strong> ${contact.phone}</p>
    `;
}

async function viewContacts() {

    const response = await fetch("/contacts");

    const contacts = await response.json();

    let output = "<h2>Emergency Contacts</h2><ul>";

    contacts.forEach(contact => {

        output += `

            <li>

                <strong>${contact.name}</strong>

                <br>

                ${contact.phone}

            </li>

            <br>

        `;

    });

    output += "</ul>";

    document.getElementById("content").innerHTML = output;

}

async function deleteRequest(id){

    let choice = confirm("Are you sure you want to delete this request?");

    if(!choice){
        return;
    }

    await fetch(`/request/${id}`,{
        method:"DELETE"
    });

    showMyRequests();

}