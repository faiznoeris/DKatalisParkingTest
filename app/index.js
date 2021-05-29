var fs = require('fs')
var filename = 'parkingdata.json'
var parkingJSON = {
    parking_lot_size: 0,
    parking_lot: [],
    current_index: 0,
    available_slot: [],
    filled_slot: 0,
}

// read file from .json if available
// if not, create the file
try {
    parkingJSON = JSON.parse(fs.readFileSync(`./${filename}`, 'utf8'))
} catch (err) {
    fs.writeFileSync(`./${filename}`, JSON.stringify(parkingJSON), 'utf-8')
}

// sort parking_lot array by slot
function sortParkingLot(array) {
    return array.sort(function compare(a, b) {
        if (a.slot < b.slot) {
            return -1
        }
        if (a.slot > b.slot) {
            return 1
        }
        return 0
    })
}

function create_parking_lot(size) {
    parkingJSON.parking_lot_size = size
    for (var i = 1; i <= size; i++) {
        parkingJSON.available_slot.push(i)
    }
    console.log(
        'Created parking lot with ' + parkingJSON.parking_lot_size + ' slots'
    )

    fs.writeFileSync(`./${filename}`, JSON.stringify(parkingJSON), 'utf-8')
}

function park(registration_no) {
    parkingJSON.filled_slot++
    if (parkingJSON.parking_lot_size == 0) {
        console.log('You must create the parking lot first')
    } else if (parkingJSON.filled_slot > parkingJSON.parking_lot_size) {
        console.log('Sorry, parking lot is full')
    } else {
        parkingJSON.parking_lot[parkingJSON.current_index] = {
            slot: parkingJSON.available_slot[0],
            regis: registration_no,
        }

        console.log('Allocated slot number: ' + parkingJSON.available_slot[0])
        parkingJSON.current_index++
        parkingJSON.available_slot.shift()

        fs.writeFileSync(
            `./${filename}`,
            JSON.stringify({
                ...parkingJSON,
                parking_lot: sortParkingLot(parkingJSON.parking_lot),
            }),
            'utf-8'
        )
    }
}

function leave(registration_no, parking_hours) {
    if (parkingJSON.parking_lot_size == 0) {
        console.log('You must create the parking lot first')
    } else {
        // get index of leaving vehicle in array parking_lot
        var index_found = -1
        for (index = 0; index < parkingJSON.parking_lot.length; ++index) {
            if (parkingJSON.parking_lot[index].regis == registration_no) {
                index_found = index
                break
            }
        }

        var slot = parkingJSON.available_slot[0]
        // get slot of leaving vehicle 
        if (parkingJSON.parking_lot[index]) {
            slot = parkingJSON.parking_lot[index].slot
        }

        if (slot > parkingJSON.parking_lot_size) {
            console.log(
                'Parking slot size is only ' + parkingJSON.parking_slot_size
            )
        } else if (index_found == -1) {
            console.log('Registration number ' + registration_no + ' not found')
        } else {
            // calculate parking charge
            var charge = 10
            if (parking_hours > 2) {
                charge = charge + 10 * (parking_hours - 2)
            }

            // remove leaving vehicle from parking_lot array
            parkingJSON.parking_lot.splice(index_found, 1)
            parkingJSON.available_slot.push(slot)

            parkingJSON.filled_slot--
            parkingJSON.current_index--

            console.log(
                'Registration number ' +
                    registration_no +
                    ' with Slot Number ' +
                    slot +
                    ' is free with Charge ' +
                    charge
            )

            fs.writeFileSync(
                `./${filename}`,
                JSON.stringify({
                    ...parkingJSON,
                    parking_lot: sortParkingLot(parkingJSON.parking_lot),
                }),
                'utf-8'
            )
        }
    }
}

function status() {
    console.log('Slot No.    Registration No.')
    for (index = 0; index < parkingJSON.parking_lot.length; ++index) {
        console.log(
            parkingJSON.parking_lot[index].slot +
                '           ' +
                parkingJSON.parking_lot[index].regis
        )
    }
}

module.exports = {
    create_parking_lot,
    park,
    leave,
    status,
}
