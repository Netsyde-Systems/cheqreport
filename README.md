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

Running either 

`cheqreport`  
or   
`cheqreport --help`  

returns the following help information: 

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

`cheqreport run reportname`

where reportname is either of `reservationcosts` or `ordercosts`.

If reportname is omitted, the default `reservationcosts` report is executed.

Running a report should present you with output similar to the following.  Note that it is normal for the data loading process to take several seconds.  

```
Loading customers...
Loading equipment...
Loading reservations...
Creating reservationcosts Report
Your cheqreport has been successfully saved to: C:\Users\username\reservationcosts_2022-08-23T01-07-04_328Z.xlsx
```

## Installation Errors

If you experience an unusual error when running the cheqreport install command, it may be due to a known issue with some recent versions of npm.  Update your npm version using the following command:  

`npm i -g npm@8.18.0`

And then try to install CheqReport again: 

`npm i -g https://github.com/Netsyde-Systems/cheqreport.git`

### Local Install Alternative

If still receiving odd errors, you can try a local installation which separates the git pull and npm install steps, and forces an installation location of your choice. 

Check to see you have a local copy of [git](https://git-scm.com/) installed: 

`git --version`

If this command returns an error then install the latest version of git [from here](https://git-scm.com/downloads).

After git is installed, navigate to a local directory of your choice where you have full read/write privileges.  

Clone a local copy of the CheqReport repository as follows: 

`git clone https://github.com/Netsyde-Systems/cheqreport.git`

Navigate to the newly created cheqreport subdirectory and install cheqreport and its dependencies: 

`npm i`

Then install it globally to your machine so that it can be accessed via command line anywhere: 

`npm i -g`
