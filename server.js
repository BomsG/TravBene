import { Web5 } from "@web5/api";
const { web5, did: userDid } = await Web5.connect();
//Schema we'll use for Trip
const schema = {
    "context": 'https://schema.org/',
    "type": 'Trip',
    get uri() { return this.context + this.type; }
}

//Query for all trips(search dwn records)
async function queryTrips() {
    let { records } = await web5.dwn.records.query({
        message: {
            filter: {
                schema: schema.uri
            }
        },
        dateSort: 'createdAscending'
    });
    return records;
}

let trip = {
    "@context": schema.context,
    "@type": schema.type,
    "name": "My Trip to the Moon",
    "description": "A trip to the moon in a shuttle.",

    // "startDate": "2021-01-01",
    // "endDate": "2021-01-02",
}



// async function tripExist(trip) {
//     for (let existingTrip of existingTrips) {
//         const tripData = await existingTrip.data.json();
//         let exist = tripData.name;
//         return (exist === trip.name);
//     }
// }
//Create a trip record
async function createTrip() {
    
        const response = await web5.dwn.records.create({
            data: trip,
            message: {
                schema: schema.uri,
                dataFormat: 'application/json',
                published: true
            }
        });
        if (response.status.code === 202) {
            console.log(`Trip for ${trip.name} added successfully`);
        } else {
            console.log(`${response.status}. Error adding entry for ${trip.name}`);
        }
        // }
}


async function updateTrip(id, newData) {
    const { record: tripToUpdate } = await web5.dwn.records.read({
        message: {
            filter: {
                recordId: id,
            }
        }
    });
    const tripData = await tripToUpdate.data.json();
    const data = { ...tripData, ...newData };
    console.log(data);
    // console.log(`Updated trip: ${tripToUpdate}`);
    const response = await tripToUpdate.update({
        data,
    });
    if (response.status.code === 202) {
        console.log(`Trip for ${trip.name} updated successfully`);
    } else{
        console.log(`${response.status}. Error updating entry for ${trip.name}`);
    }                                                                                                       
}

async function deleteTrip(id) {
    // for (let trip of existingTrips) {
    const response = await web5.dwn.records.delete({
        message: {
            recordId: id
        }
    })
    // }
    if (response.status.code === 202) {
        console.log(`Trip for ${trip.name} deleted successfully`);
    } else{
        console.log(`${response.status}. Error deleting entry for ${trip.name}`);
    }                                                                                                       

}
let existingTrips = await queryTrips();
console.log(existingTrips.length);
await createTrip();
if (existingTrips && existingTrips.length > 0) await updateTrip(existingTrips[0]?.id, { name: "Your ideal trip to America" })
if (existingTrips && existingTrips.length > 0) await deleteTrip(existingTrips[0].id);
process.exit(0);
