# FoC-2015

<h1> Young Rewired State Festival of Code 2015 @ Cyber-duck </h1>

<h2> Structure </h2>

<h3> Backend </h3>

<h4> API </h4>

POST /api/user to create/"authenticate" user
Pass json object containing: firstName, lastName, gender, minAge, maxAge, number, email, serviceID, serviceName
Returns {"userID" : "14"}. Store this to make a match request later on or access match page.

POST /api/request to create a match request
Pass JSON object containing: userID (received), gpsX (of the user), gpsY, publicLatitude, publicLongitude, publicName, endDate, activityName
Returns {"requestID" : "2114"} on success.

POST /api/matches to receive a list of all matched details
Pass JSON object containing: userID (Received before).
Returns
{
	"matches" : {[
					{ 
						"activityName" : "gaming",
						"requestID" : "324243234",
						"publicName" : "Ealing",
						"distanceFromVenue" : "2",
						"endDate" : "12/12/2012",
						"users" : [{"firstName" : "Bob",
									"lastName" : "Vagan",
									"number" : "0221232323",
									"email" : "awhwda@Wda.com"
									"serviceID" : "1212313",
									"serviceName" : "facebook",
									"matchID"	: "21" //The id of the "matched up" requests
									"accepted" : "true", //rejeted will be not be on this list. False means pending.
									"distanceFromVenue" "1"
									},
									{"firstName" : "ALice",
									"lastName" : "Joan",
									"number" : "0221232323",
									"matchID"	: "29",
									"email" : "awhwda@Wda.com"
									"serviceID" : "1666313",
									"serviceName" : "facebook",
									"accepted" : "false",
									"distanceFromVenue" "3"
									}
						]
				},
				{ 
						"activityName" : "gardening",
						"endDate" : "12/02/1234",
						"requestID" : "12321",
						"publicName" : "Northwood",
						"distanceFromVenue" : "2",
						"users" : [{"firstName" : "Bob",
									"lastName" : "Vagan",
									"number" : "0221232323",
									"matchID"	: "26",
									"email" : "awhwda@Wda.com"
									"serviceID" : "1212313",
									"serviceName" : "Facebook",
									"accepted" : "true",
									"distanceFromVenue" "1"
									},
									{"firstName" : "Bond",
									"lastName" : "Joan",
									"matchID"	: "25",
									"number" : "0221232323",
									"email" : "awhwda@Wda.com"
									"serviceID" : "1666313",
									"serviceName" : "Facebook",
									"distanceFromVenue" "3"
									}
						]
				}
			]
	}
}	

POST /api/delete to delete
Pass JSON object {"requestID" : "21321" }


<h4> Database </h4>


<h5>tb-main</h5>
<table>
	<tr>
		<td>ID</td>
		<td>Int</td>
		<td>Legitimate</td>
	</tr>
	<tr>
		<td>Gender</td>
		<td>Int</td>
		<td>M F N</td>
	</tr>
	<tr>
		<td>First Name</td>
		<td>String</td>
		<td>Under 50 char</td>
	</tr>
	<tr>
		<td>Last Name</td>
		<td>String</td>
		<td>Under 50 char</td>
	</tr>
	<tr>
		<td>DOB</td>
		<td>Date</td>
		<td>Check Age</td>
	</tr>
	<tr>
		<td>SMS</td>
		<td>String</td>
		<td>Legitimate</td>
	</tr>
	<tr>
		<td>E-Mail</td>
		<td>String</td>
		<td>Legitimate</td>
	</tr>


<h2> Rules </h2>

- HTML/CSS/JS for frontend goes in public, rest go in corresponding folders

- Do not break code (in the master branch)

- Log issues in Github and then contact appropriate member of team

- Prefer tabs over spaces for indentation

- Do not introduce new features without consulting team/subteam

- Try to commit + push at the very least after a feature has been implemeneted

- Remember to commit -> pull -> resolve any conflicts -> push 


<p>
Team
<ul>
	<li>Harjot	Tim</li>
	<li>Jake	Chris</li>
	<li>Daniel	Charles</li>
	<li>Zekki </li>
</ul>

Description

This app will use facebook to authenticate people.
Then people put in the activities they wish to do and
they will be matched up with someone else with the same
interests.


APIs
<ul>
<li>Facebook	Clockwork</li>
<li>Maps		(Microsoft Age API)</li>
</ul>

Homepage

Login with Facebook
Geolocate
FB account has to be active at least 6 months
Notice / Activity Board


Notifications

SMS	FB	Email

Parameters

What you wanna do
Time limit
age ranges (fb) + [microsoft api]
location (distances)
gender checkbox
</p>