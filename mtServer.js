const opcua = require("node-opcua");
let SerialPort = require('serialport');     // include the serialport library
let	portName =  process.argv[2];            // get the port name from the command line
let baudRate = process.argv[3];             // get the baudrate from the command line         

let Weight=0;
let WeightUOM="";
let Stable=false;
let RawResponse="";
let SerialPortConnected=false;
let Reset=false;
let SerialNumber="";
let Zero=false;
let Tare=false;
let DecodedResponse="";
let TareWeight=0;
let TareWeightUOM="";
let SoftwareVersion="";
let StableWeight=false;
let ReadWeightImmediate=false;
let ReadWeightImmediateRepeat=false;


const server = new opcua.OPCUAServer({
    port: 4335, // the port of the listening socket of the server
    resourcePath: "/MT_Server", // this path will be added to the endpoint resource name
	 buildInfo : {
    productName: "MT-SIC OPC UA Server (Tag Based)",
    buildNumber: "0001",
    buildDate: new Date(2021,9,17),
	manufacturerName: "KevinHunter"
}
   });

   function post_initialize() {
    console.log("OPC UA Server initializing");
    function construct_my_address_space(server) {

    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();

    
    const MettlerToledo = namespace.addObject({
    organizedBy: addressSpace.rootFolder.objects,
    browseName: "MettlerToledo"
	});
	
   

namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "Weight",
    dataType: "Float",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.Float, value: Weight });
        },
        set: function (variant) {
            Weight = variant.value;
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead",
    userAccessLevel: "CurrentRead"
});

namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "WeightUOM",
    dataType: "String",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.String, value: WeightUOM });
        },
        set: function (variant) {
            WeightUOM = variant.value;
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead",
    userAccessLevel: "CurrentRead"
});

namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "WeightStable",
    dataType: "Boolean",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.Boolean, value: Stable });
        },
        set: function (variant) {
            Stable = variant.value;
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead",
    userAccessLevel: "CurrentRead"
});

namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "RawResponse",
    dataType: "String",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.String, value: RawResponse });
        },
        set: function (variant) {
            RawResponse = variant.value;
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead",
    userAccessLevel: "CurrentRead"
});

namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "SerialPortConnected",
    dataType: "Boolean",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.Boolean, value: SerialPortConnected });
        },
        set: function (variant) {
            SerialPortConnected = variant.value;
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead",
    userAccessLevel: "CurrentRead"
});

namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "Reset",
    dataType: "Boolean",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.Boolean, value: Reset });
        },
        set: function (variant) {
            Reset = variant.value;
            if (Reset ==true){
                sendScalesCommand("@");
                Reset=false;
                TareWeight=0;
                TareWeightUOM="";
                sendScalesCommand("S");
            };
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead | CurrentWrite",
    userAccessLevel: "CurrentRead | CurrentWrite"
});
namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "Zero",
    dataType: "Boolean",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.Boolean, value: Zero });
        },
        set: function (variant) {
            Zero = variant.value;
            if (Zero ==true){
                sendScalesCommand("Z");
                Zero=false;
                sendScalesCommand("S");
            };
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead | CurrentWrite",
    userAccessLevel: "CurrentRead | CurrentWrite"
});
namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "Tare",
    dataType: "Boolean",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.Boolean, value: Tare });
        },
        set: function (variant) {
            Tare = variant.value;
            if (Tare ==true){
                sendScalesCommand("T");
                Tare=false;
                sendScalesCommand("S");
            };
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead | CurrentWrite",
    userAccessLevel: "CurrentRead | CurrentWrite"
});

namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "SerialNumber",
    dataType: "String",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.String, value: SerialNumber });
        },
        set: function (variant) {
            SerialNumber = variant.value;
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead",
    userAccessLevel: "CurrentRead"
});

namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "DecodedResponse",
    dataType: "String",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.String, value: DecodedResponse });
        },
        set: function (variant) {
            DecodedResponse = variant.value;
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead",
    userAccessLevel: "CurrentRead"
});

namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "TareWeight",
    dataType: "Float",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.Float, value: TareWeight });
        },
        set: function (variant) {
            TareWeight = variant.value;
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead",
    userAccessLevel: "CurrentRead"
});

namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "TareWeightUOM",
    dataType: "String",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.String, value: TareWeightUOM });
        },
        set: function (variant) {
            TareWeightUOM = variant.value;
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead",
    userAccessLevel: "CurrentRead"
});

namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "SoftwareVersion",
    dataType: "String",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.String, value: SoftwareVersion });
        },
        set: function (variant) {
            SoftwareVersion = variant.value;
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead",
    userAccessLevel: "CurrentRead"
});

namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "ReadStableWeight",
    dataType: "Boolean",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.Boolean, value: StableWeight });
        },
        set: function (variant) {
            StableWeight = variant.value;
            if (StableWeight ==true){
                sendScalesCommand("S");
                StableWeight=false;
            };
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead | CurrentWrite",
    userAccessLevel: "CurrentRead | CurrentWrite"
});

namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "ReadWeightImmediate",
    dataType: "Boolean",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.Boolean, value: ReadWeightImmediate });
        },
        set: function (variant) {
            ReadWeightImmediate = variant.value;
            if (ReadWeightImmediate ==true){
                sendScalesCommand("SI");
                ReadWeightImmediate=false;
            };
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead | CurrentWrite",
    userAccessLevel: "CurrentRead | CurrentWrite"
});

namespace.addVariable({
	componentOf: MettlerToledo,
    browseName: "ReadWeightImmediateRepeat",
    dataType: "Boolean",    
    value: {
        get: function () {
            return new opcua.Variant({dataType: opcua.DataType.Boolean, value: ReadWeightImmediateRepeat });
        },
        set: function (variant) {
            ReadWeightImmediateRepeat = variant.value;
            if (ReadWeightImmediateRepeat ==true){
                sendScalesCommand("SIR");
                ReadWeightImmediateRepeat=false;
            };
            return opcua.StatusCodes.Good;
        }
    },
    accessLevel: "CurrentRead | CurrentWrite",
    userAccessLevel: "CurrentRead | CurrentWrite"
});



}
construct_my_address_space(server);
server.start(function() {
    console.log("Server is now listening ... ( press CTRL+C to stop)");
    console.log("port ", server.endpoints[0].port);
    const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
	console.log(" the primary server endpoint url is ", endpointUrl );
    
});

initializeScales();
}

server.initialize(post_initialize);


if (!portName)  {
  giveInstructionsPort();
}

if (!baudRate)  {
    giveInstructionsBaud();
  }

var myPort = new SerialPort(portName, {
    baudRate: parseInt(baudRate)
  });// open the port
var Readline = SerialPort.parsers.Readline; // make instance of Readline parser
var parser = new Readline();                // make a new parser to read ASCII lines
myPort.pipe(parser);                        // pipe the serial stream to the parser

// these are the definitions for the serial events:
myPort.on('open', showPortOpen);    // called when the serial port opens
myPort.on('close', showPortClose);  // called when the serial port closes
myPort.on('error', showError);      // called when there's an error with the serial port
parser.on('data', readSerialData);  // called when there's new data incoming

// these are the functions called when the serial events occur:
function showPortOpen() {
    SerialPortConnected=true;
    console.log('port open. Data rate: ' + myPort.baudRate);
}

function readSerialData(data) {
    tempdata = data.replace(/(\r\n|\n|\r)/gm, "") +"  ";
    ResponseCode = tempdata.substr(0,4);

    switch (ResponseCode) {
        case "S S ":
            output=data.replace("S S","").trim().split(" ");
            Weight=parseFloat(output[0]);
            WeightUOM=output[1];
            Stable=true;
            DecodedResponse="Stable Weight";
        break;
        case "S D ":
            output=data.replace("S D","").trim().split(" ");
            Weight=parseFloat(output[0]);
            WeightUOM=output[1];
            Stable=false;
            DecodedResponse="Dynamic Weight";
        break;
        case "S I ":
            DecodedResponse="Command understood but not executable at present";
        break;
        case "S - ":
            DecodedResponse="Scale in underload range";
        break;
        case "S + ":
            DecodedResponse="Scale in overload range";
        break;
        case "I4 A":
            SerialNumber=data.substr(6,data.length-8);
            DecodedResponse="Serial Number read executed successfully";
        break;
        case "I4 I":
            DecodedResponse="Serial Number command understood but not executable at present";
        break;
        case "Z A ":
            TareWeight=0;
            DecodedResponse="Zero command executed successfully";
        break;
        case "Z I ":
            DecodedResponse="Zero command understood but not executable";
        break;
        case "Z + ":
            DecodedResponse="Upper limit of zero setting range exceeded";
        break;
        case "Z - ":
            DecodedResponse="Zero command executed successfully";
        break;
        case "T S ":
            output=data.replace("T S","").trim().split(" ");
            TareWeight=parseFloat(output[0]);
            TareWeightUOM=output[1];
            DecodedResponse="Tare command executed successfully";
        break;
        case "I3 A":
            SoftwareVersion=data.substr(6,data.length-8);
            DecodedResponse="Software version command executed successfully";
        break;
        case "I3 I":
            DecodedResponse="Software version command understood but not executable at present";
        break;
        default:
            DecodedResponse="Response code not recognised";
            console.log("Unrecognised response code:"+ResponseCode+":");
    }
   
    
    RawResponse=data;
    
  
}

function showPortClose() {
    SerialPortConnected=false;
  console.log('port closed.');
}

function showError(error) {
  console.log('Serial port error: ' + error);
}

function giveInstructionsPort() {
    console.log('you did not give a port name');
    console.log('To run this properly, type \n');
    console.log('node mtServer.js portname baudrate\n');
    process.exit(0);
}

function giveInstructionsBaud() {
    console.log('you did not give a baud rate');
    console.log('To run this properly, type \n');
    console.log('node mtServer.js portname baudrate\n');
    process.exit(0);
}


function sendScalesCommand(command){
    myPort.write(command+"\r\n");
}

function initializeScales(){
    sendScalesCommand("@");
    sendScalesCommand("I3");
    sendScalesCommand("S");
    console.log("Scales intitializing");
}