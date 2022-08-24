CheqReport
==========

A command line platform for creating custom [Cheqroom](https://www.cheqroom.com/) reports. 

## Installation

Check if you already have the [Node.js](https://nodejs.org/) runtime installed:  

`node --version`  
`npm --version`  

If either of the above commands return errors, [download and install](https://nodejs.org/) the latest LTS node.js runtime for your computer platform. 

If the Node version is reported as *less* than *16.13.0*, you may experience usage errors, and will likely need to [upgrade your Node installation](https://nodejs.org/).

Once you have a Node runtime installed, install CheqReport via npm: 

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

The first time you execute cheqreport, you must authenticate with your Cheqroom account details: 

`cheqreport auth email@server.com cheqroompassword`

This will store your Cheqroom userid and a jwt token for future use.  Subsequently, you can generate reports until your token expires (expiry time is controlled at Cheqroom's end): 

`cheqreport run`

This command should present you with output similar to the following.  Note that it is normal for the data loading process to take several seconds.  

```
Loading customers...
Loading equipment...
Loading reservations...
Creating projectrentalcosts Report
Your cheqreport has been successfully saved to: C:\Users\username\projectrentalcosts_2022-08-23T01-07-04_328Z.xlsx
```

At this time, only the requested *projectrentalcosts* report has been created.  It is run by default regardless of the reportname parameter provided, or even if it is is omitted.  

Future reports should be easy to create since authentication, data api integration, token storage, and excel reporting logic has already been implemented. If and when more than one report is available to execute, they can be specified by name: 

`cheqreport run reportname`
