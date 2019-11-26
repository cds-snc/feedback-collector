# Feedback Collector

**Demo:** https://cds-feedback-collector.herokuapp.com/

**Based on node-starter-app** https://github.com/cds-snc/node-starter-app/

## Intro 

The Feedback Collector captures form data and i) emails it to you (if you want) and ii) puts it in a database for later analysis. 

The Feedback Collector provides a generic URL endpoint to submit forms to. Depending on your choice it will then i) redirect the user to a page that you specify, or ii) send a json response confirming the data was recieved. 

To set up, [log in](https://cds-feedback-collector.herokuapp.com/) and go through the steps to add a new form. After confirming your email you can then use the endpoint with the ID generated for your form.

## Usage

After you login and create a form, you will get an email with a confirmation link. At that point you can hook this up to your form! Copy the ID for your form from the [my-forms page](https://cds-feedback-collector.herokuapp.com/en/my-forms) into the form you wish to hook up:
```
<form method="post" action="https://cds-feedback-collector.herokuapp.com/en/send?id=YOUR_FORM_ID" />
```

That's all there is to it!


## Install + Dev Mode

```bash
npm install
npm run dev
```


## Tech stack

For documentation related to the tech stack used in this app, see the [node-starter-app](https://github.com/cds-snc/node-starter-app/) documentation.
