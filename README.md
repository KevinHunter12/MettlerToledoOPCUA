# MettlerToledoOPCUA
OPC UA Server for Mettler Toledo Scales

Many of the various Mettler Toldeo Scales only have an RS232 interface which makes reading the data difficult if you are trying to connect the data from the scales into an MES system such as SAP ME (Manufacturing Execution) or SAP DMC (Digital Manufacturing Cloud).

This project is written in Javascript using the Node-OPCUA and SerialPort libraries.

NodeJS was selected due to its asynchronous nature and because it can be run on Window, Linux or Mac.

The project was developed and tested using Windows 10, NodeJS 14 and a Mettler Toledo Viper BC scale.

The plan is that this will also be tested on a Raspberry PI as this would provide a low cost method of adding OPC UA and ethernet capabilites.

Install Procedure:

Install nodejs 14
Clone all the files from here into your own directory
Install the dependencies using "npm install node-opcua" and "npm install serialport"
Execute "node mtServer ComX" where ComX is the com port where the scales are connected


