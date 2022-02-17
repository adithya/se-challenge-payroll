# Wave Software Development Challenge

Applicants for the Full-stack Developer role at Wave must
complete the following challenge, and submit a solution prior to the onsite
interview.

The purpose of this exercise is to create something that we can work on
together during the onsite. We do this so that you get a chance to collaborate
with Wavers during the interview in a situation where you know something better
than us (it's your code, after all!)

There isn't a hard deadline for this exercise; take as long as you need to
complete it. However, in terms of total time spent actively working on the
challenge, we ask that you not spend more than a few hours, as we value your
time and are happy to leave things open to discussion in the on-site interview.

Please use whatever programming language and framework you feel the most
comfortable with.

Feel free to email [dev.careers@waveapps.com](dev.careers@waveapps.com) if you
have any questions.

## Project Description

Imagine that this is the early days of Wave's history, and that we are prototyping a new payroll system API. A front end (that hasn't been developed yet, but will likely be a single page application) is going to use our API to achieve two goals:

1. Upload a CSV file containing data on the number of hours worked per day per employee
1. Retrieve a report detailing how much each employee should be paid in each _pay period_

All employees are paid by the hour (there are no salaried employees.) Employees belong to one of two _job groups_ which determine their wages; job group A is paid $20/hr, and job group B is paid $30/hr. Each employee is identified by a string called an "employee id" that is globally unique in our system.

Hours are tracked per employee, per day in comma-separated value files (CSV).
Each individual CSV file is known as a "time report", and will contain:

1. A header, denoting the columns in the sheet (`date`, `hours worked`,
   `employee id`, `job group`)
1. 0 or more data rows

In addition, the file name should be of the format `time-report-x.csv`,
where `x` is the ID of the time report represented as an integer. For example, `time-report-42.csv` would represent a report with an ID of `42`.

You can assume that:

1. Columns will always be in that order.
1. There will always be data in each column and the number of hours worked will always be greater than 0.
1. There will always be a well-formed header line.
1. There will always be a well-formed file name.

A sample input file named `time-report-42.csv` is included in this repo.

### What your API must do:

We've agreed to build an API with the following endpoints to serve HTTP requests:

1. An endpoint for uploading a file.

   - This file will conform to the CSV specifications outlined in the previous section.
   - Upon upload, the timekeeping information within the file must be stored to a database for archival purposes.
   - If an attempt is made to upload a file with the same report ID as a previously uploaded file, this upload should fail with an error message indicating that this is not allowed.

2. An endpoint for retrieving a payroll report structured in the following way:

   _NOTE:_ It is not the responsibility of the API to return HTML, as we will delegate the visual layout and redering to the front end. The expectation is that this API will only return JSON data.

   - Return a JSON object `payrollReport`.
   - `payrollReport` will have a single field, `employeeReports`, containing a list of objects with fields `employeeId`, `payPeriod`, and `amountPaid`.
   - The `payPeriod` field is an object containing a date interval that is roughly biweekly. Each month has two pay periods; the _first half_ is from the 1st to the 15th inclusive, and the _second half_ is from the 16th to the end of the month, inclusive. `payPeriod` will have two fields to represent this interval: `startDate` and `endDate`.
   - Each employee should have a single object in `employeeReports` for each pay period that they have recorded hours worked. The `amountPaid` field should contain the sum of the hours worked in that pay period multiplied by the hourly rate for their job group.
   - If an employee was not paid in a specific pay period, there should not be an object in `employeeReports` for that employee + pay period combination.
   - The report should be sorted in some sensical order (e.g. sorted by employee id and then pay period start.)
   - The report should be based on all _of the data_ across _all of the uploaded time reports_, for all time.

As an example, given the upload of a sample file with the following data:

   | date       | hours worked | employee id | job group |
   | ---------- | ------------ | ----------- | --------- |
   | 4/1/2023   | 10           | 1           | A         |
   | 14/1/2023  | 5            | 1           | A         |
   | 20/1/2023  | 3            | 2           | B         |
   | 20/1/2023  | 4            | 1           | A         |

A request to the report endpoint should return the following JSON response:

   ```json
   {
     "payrollReport": {
       "employeeReports": [
         {
           "employeeId": "1",
           "payPeriod": {
             "startDate": "2023-01-01",
             "endDate": "2023-01-15"
           },
           "amountPaid": "$300.00"
         },
         {
           "employeeId": "1",
           "payPeriod": {
             "startDate": "2023-01-16",
             "endDate": "2023-01-31"
           },
           "amountPaid": "$80.00"
         },
         {
           "employeeId": "2",
           "payPeriod": {
             "startDate": "2023-01-16",
             "endDate": "2023-01-31"
           },
           "amountPaid": "$90.00"
         }
       ]
     }
   }
   ```

We consider ourselves to be language agnostic here at Wave, so feel free to use any combination of technologies you see fit to both meet the requirements and showcase your skills. We only ask that your submission:

- Is easy to set up
- Can run on either a Linux or Mac OS X developer machine
- Does not require any non open-source software

### Documentation:

Please commit the following to this `README.md`:

1. Instructions on how to build/run your application
1. Answers to the following questions:
   - How did you test that your implementation was correct?
   - If this application was destined for a production environment, what would you add or change?
   - What compromises did you have to make as a result of the time constraints of this challenge?

## Submission Instructions

1. Clone the repository.
1. Complete your project as described above within your local repository.
1. Ensure everything you want to commit is committed.
1. Create a git bundle: `git bundle create your_name.bundle --all`
1. Email the bundle file to [dev.careers@waveapps.com](dev.careers@waveapps.com) and CC the recruiter you have been in contact with.

## Evaluation

Evaluation of your submission will be based on the following criteria.

1. Did you follow the instructions for submission?
1. Did you complete the steps outlined in the _Documentation_ section?
1. Were models/entities and other components easily identifiable to the
   reviewer?
1. What design decisions did you make when designing your models/entities? Are
   they explained?
1. Did you separate any concerns in your application? Why or why not?
1. Does your solution use appropriate data types for the problem as described?

# Code Author Documentation

## Build and run using Docker

### Required Depdencies

1. Docker ([macOS](https://docs.docker.com/desktop/mac/install/)/[Linux](https://docs.docker.com/engine/install/#server))

### Getting Started

The quickest way to get up and running with the application is to run docker-compose from the root of the project directory:

```
docker-compose up
```

By default the API can be found at the follow URL: http://localhost:7600

## Build and run without Docker

### Required Depdencies
1. Node.js 16.14.0 ([macOS](https://nodejs.org/en/download/)/[Linux](https://nodejs.org/en/download/package-manager/))
2. PostgreSQL ([macOS](https://www.postgresql.org/download/macosx/)/[Linux](https://www.postgresql.org/download/))

### Setting up the Database

The database can be setup by logging into psql, you can login to psql by using the default database and user you setup during installation, in most cases they are both named postgres:

MacOS: 

> Note: Some MacOS installers may make PSQL accessible through a GUI application

```
psql postgres
```

Linux:

```
sudo -u postgres psql
```

From psql run the following commands to create the database and user that the application relies on:
```
CREATE DATABASE "payroll-challenge-db";
```
```
create user waveuser with encrypted password 'pg@admin';
```
```
ALTER DATABASE "payroll-challenge-db" OWNER TO waveuser;
```
### Getting Started

After setting up the database, from the root directory install the npm modules by running the following command:

```
npm i
```

After setting up the npm modules the server can be started by running the following command:

```
npm start
```

By default the API can be found at the follow URL: http://localhost:3000

## Using the API

As requested in the challenge description, the API has two endpoints, one for uploading the time reports, and one for requesting payroll reports. If you like you can use the API by importing the [repo's insomnia collection](https://github.com/adithya/se-challenge-payroll/blob/main/insomnia-collection.json).

> Note: If you **running the application using docker**, the ports in the URL will have to change from **3000 to 7600**

### Uploading Time Reports

The upload endpoint is setup as a multipart form with one field "time-report",  which allows you to provide a a file path to the time-report you want to upload. You can send a request to the upload endpoint by opening the command line, navigating to the location of the sample time report (located at the root of the repo) and running the following command.

Request: 

```
curl --request POST \
  --url http://localhost:3000/upload \
  --header 'Content-Type: multipart/form-data' \
  --form time-report=@time-report-42.csv
```

Response:

```
"Uploaded succesfully!"
```

Attempting to upload previously uploaded time-reports will result in the following response:

```
"Upload unsuccesful. The time report you attempted to upload has the same ID as a previous time report."
```


### Requesting Payroll Reports

Requesting a payroll report is comparatively simpler than uploading, all you need to do is send a GET request to the /payrollReport endpoint, you can do so by running the command below.

Request:

```
curl --request GET \
  --url http://localhost:3000/payrollReport
```

Response (after uploading sample time report):

```
{
	"payrollReport": {
		"employeeReports": [
			{
				"employeeId": "1",
				"payPeriod": {
					"startDate": "2023-11-01",
					"endDate": "2023-11-15"
				},
				"amountPaid": "$140.00"
			},
			{
				"employeeId": "1",
				"payPeriod": {
					"startDate": "2023-11-16",
					"endDate": "2023-11-30"
				},
				"amountPaid": "$220.00"
			},
			{
				"employeeId": "1",
				"payPeriod": {
					"startDate": "2023-12-01",
					"endDate": "2023-12-15"
				},
				"amountPaid": "$140.00"
			},
			{
				"employeeId": "1",
				"payPeriod": {
					"startDate": "2023-12-16",
					"endDate": "2023-12-31"
				},
				"amountPaid": "$220.00"
			},
			{
				"employeeId": "2",
				"payPeriod": {
					"startDate": "2023-11-01",
					"endDate": "2023-11-15"
				},
				"amountPaid": "$930.00"
			},
			{
				"employeeId": "2",
				"payPeriod": {
					"startDate": "2023-12-01",
					"endDate": "2023-12-15"
				},
				"amountPaid": "$930.00"
			},
			{
				"employeeId": "3",
				"payPeriod": {
					"startDate": "2023-11-01",
					"endDate": "2023-11-15"
				},
				"amountPaid": "$580.00"
			},
			{
				"employeeId": "3",
				"payPeriod": {
					"startDate": "2023-12-01",
					"endDate": "2023-12-15"
				},
				"amountPaid": "$460.00"
			},
			{
				"employeeId": "4",
				"payPeriod": {
					"startDate": "2023-02-16",
					"endDate": "2023-02-28"
				},
				"amountPaid": "$150.00"
			},
			{
				"employeeId": "4",
				"payPeriod": {
					"startDate": "2023-11-01",
					"endDate": "2023-11-15"
				},
				"amountPaid": "$150.00"
			},
			{
				"employeeId": "4",
				"payPeriod": {
					"startDate": "2023-11-16",
					"endDate": "2023-11-30"
				},
				"amountPaid": "$450.00"
			},
			{
				"employeeId": "4",
				"payPeriod": {
					"startDate": "2023-12-01",
					"endDate": "2023-12-15"
				},
				"amountPaid": "$150.00"
			},
			{
				"employeeId": "4",
				"payPeriod": {
					"startDate": "2023-12-16",
					"endDate": "2023-12-31"
				},
				"amountPaid": "$450.00"
			}
		]
	}
}
```


## Running Tests

In order to run the tests we need to first setup the test database. Again login to psql using the default postgres database and user you created during setup:

MacOS:

```
psql postgres
```

Linux:

```
sudo -u postgres psql
```

The test database can be created by running the following commands:
```
CREATE DATABASE "payroll-challenge-db-test";
```
If the user has not already be created in the previous step, you will have to create it now:
```
create user waveuser with encrypted password 'pg@admin';
```

Set the owner of the database to the user we created:
```
ALTER DATABASE "payroll-challenge-db-test" OWNER TO waveuser;
```

After setting up the test database run the test suite from the command line using npm:

```
npm test
```

## Additional Details

1. How did you test that your implementation was correct?

Before writing any of the implementation, I started the project by first leveraging the time-report and expected payroll report in the challenge description above to write a unit test.

Initially the unit test only tested the external API by sending in the time-report and asserting the correct response for the payroll report. However as I broke down the the components I would need to create the application, I wrote smaller unit tests to test more individual functionality.

As I began to write the code, I ensured that the tests for the relevant code areas were passing, and that my code worked as expected.

Furthermore, I tested my API manually by submitting the sample time-report and verifying that the returned payroll report matched what I expected.

2. If this application was destined for a production environment, what would you add or change? 

The most pressing issue to be resolved before deployment to a production environment are the hard-coded database credentials. Given that hard-coding credentials into source code is generally considered insecure, and a potential vector for attack, I would likely leverage a secret management tool to retrieve the credentials at runtime.

From a scalability perspective there are also several issues worth addressing.

Depending on how the application is used, there will likely be many requests where we are re-calculating all pay periods for all employees, even when nothing has changed since the last request. Given a large enough number of time-report entries in the database, this can lead to signifcant performance degredation. We can resolve this issue by caching previously calculated pay periods for employees, invalidating and updating the cache when newly ingested time-reports contain data that can change the values of previously cached pay periods.

In order to avoid having to perform calculations on a potentially large amount of data in the first place, it would also be prudent to provide options for scoping payroll report requests. Currently every payroll report request requires us to perform calculations on all time report records ever uploaded. As the number of time report entries grows, the calculations will become proprtionally more expensive (O(n)). It is also diffcult to imagine that users in the real world will always need a payroll report with every pay period, for every employee. Adding the ability to scope payroll reports with date, employee ids, or job group would reduce the amount of data the payroll report logic needs to comb through, helping alleviate any potential performance bottlenecks.

While scoping payroll report requests helps, it does not solve the problem of returning more data than the front-end can render in the current view. This issue can be resolved in a straightforward manner by adding limit and offset parameters to the payroll report endpoint. This way the front-end requests only as much data as it needs, and the back-end can avoid having to calculate all pay periods for every request.

Given how expensive the payroll report request can be, it also makes sense to put in place some rate limiting. This way we avoid situations where a large number of expensive requests within a short time period, causes performance issues. 

In addition to being able to scale, an important characteristic of production systems is resiliency. This starts with avoiding expectations about inputs. Currently we expect the input, whether its the csv and its contents, or the file-name, to all be formatted exactly in the standard defined in the challenge description. However before shipping to production, we should look at the areas in the code where the input may not be what we expect, and put in place code to handle these potential errors.

Going beyond handling inputs, there are also several places in the code where promises may not resolve, or functions may not return as we expect. Putting in place proper error handling for these errors will ensure our code is more resilient in production.

3. What compromises did you have to make as a result of the time constraints of this challenge?

In addition to the items I discussed above, there are several areas where I made compromises for the sake of time.

The application's unit tests are one of the areas where I have made these compromises. Specifically, I have written many of the unit tests such that they require a database to work. While this is acceptable for tests that are specfically geared towards testing the database, it should generally be avoided. Database connections in unit tests can result in unreliable tests if the database is unreachable for some reason. It also starts blurring the lines between the role of a unit and integration test in the application's test suite. In tests that are not strictly testing the database it would make more sense to instead mock the database. Taking it one step further, refactoring the code to better isolate functionality could result in more testable code that may no longer rely on a database at all.

Another area with room for improvement is the payroll report calculator. In the process of calculating the pay periods for the all employees, and creating the JSON to be returned, the code goes over the data several times. The time complexity of this is O(cn), while this is sufficient for the purposes of a small project, I believe there is room for further optimization to get it closer to O(n). 

In retrospect I also put relatively little thought into the database schema, largely copying the format of the input CSV as the structure for my TimeReportEntry table. If we want to implement the request scoping I discussed in the previous question, revisiting the schema would likely pay dividends as there maybe several ways to improve upon the original schema to aid in querying smaller amounts of data.

Lastly, there are several areas in the application that could potentially block the execution of the application. Given more time, these area should really be refactored so as to execute asynchronously.