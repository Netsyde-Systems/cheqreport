CheqReport
==========

A command line platform for creating custom [Cheqroom](https://www.cheqroom.com/) reports. 

## Installation

Check if you already have the [Node.js](https://nodejs.org/) runtime installed:  

`node --version`  
`npm --version`  

If either of the above commands return errors, [download and install](https://nodejs.org/en/) the latest LTS node.js binary for your computer platform. 

Once you have the node runtime installed then you can easily install CheqReport via npm: 

`npm i -g https://github.com/Netsyde-Systems/cheqreport.git`

## Usage

`cheqreport`  
or   
`cheqreport --help`  

Returns the following help information: 

```
cheqreport <cmd> [args]

Commands:
  cheqreport run [reportname]        Runs custom report
  cheqreport auth <user> <password>  Authenticates user against cheqroom API
  cheqreport                         Default command is help           [default]

Options:
  --version  Show version number                                       [boolean]
  --help     Show help
```

The first time you execute cheqreport, you must authenticate with your cheqroom account details: 

`cheqreport auth email@server.com cheqreportpassword`

This will store your userid and a jwt token for future use.  Subsequently, you can generate reports until your token expires (expiry time is controlled at cheqreport's end): 

`cheqreport run`

At this time, only the *projectrentalcosts* report has been created, so it is run by default no matter the reportname provided, or even if it is is omitted.  

Future reports will be easy to integrate since authentication, data api integration, token storage, and excel creation logic has already been implemented. At that point, different reports will be executed by name: 

`cheqreport run reportname`
