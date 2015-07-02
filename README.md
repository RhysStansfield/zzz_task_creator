# ZZZ Task Creator

Simple app for reading from, and writing to, the ZZZ's API.

### Dependencies

You will need Ruby (>= 2.0), Zendesk App Tools (ZAT) and ngrok to develop locally.

After you've ensured you've got the correct version of Ruby install the ZAT gem:

    $ gem install zendesk_apps_tools

Install ngrok by grabbing a pre-built package from here: https://ngrok.com/download and unzipping it to the directory of your choice

Check it works (from the directory you unzipped it to):

    $ ./ngrok http 3000

You'll also want to have git installed for version control and to clone this repo to your local machine.

Now you can actually do some development!

### Development

First off boot up rails in one terminal tab and ngrok in another.

First tab (ZZZ project root):

    $ bundle exec rails s

Second tab (directory ngrok was installed to):

    $ ./ngrok http 3000

If you're using a different port to run the ZZZ's rails project locally switch out 3000 for whatever your port address is.  Once started up ngrok should give you some information about the subdomain it has set up to tunnel requests to your local machine.  You should see something like this:

    Forwarding                    https://35ca6810.ngrok.io -> localhost:3000

Keep a note of the domain, we'll be using it in a moment.

Get an access token - go into the rails console in another terminal window and run:

    zzz2-1.9.3-(main):0 > ApiKey.last.access_token

Now in another terminal tab go to the root of this project (the ZZZ Task Creator) and start it up:

    $ zat server

It will ask you to first enter the domain name, grab it from the forwarding information you got from ngrok earlier WITHOUT the protocol - i.e. just 35ca6810.ngrok.io and NOT https://35ca6810.ngrok.io - then hit enter.

It'll then ask for your token, copy and paste the access token we got from the rails console in and hit enter.

Finally log into Zendesk, open a ticket and append ?zat=true to the url - you will also need to disable insecure content blocking in that tab of your browser for this domain.

You should now be running your local version of the ZZZ Task Creator app within Zendesk and can just refresh the page to see changes you've made.

For more in-depth information on ZAT and ngrok check out the following links:

<https://support.zendesk.com/hc/en-us/articles/203691236-Installing-and-using-the-Zendesk-apps-tools>
<https://developer.zendesk.com/apps/docs/agent/introduction>
<https://ngrok.com/docs>

#### Development using Staging

You can also set up ZAT to point to the ZZZ's staging sever (or even production, but don't do that unless you have an extremely good reason!) - just change the domain to staging.zzz.co.uk when you start up ngrok and give it an access token from staging.

The advantage of this method is that you don't need to use ngrok at all.

The disadvantage is that the staging server shuts itself down after a period of inactivity (about 20/30 minutes), and it takes long enough to boot up again the next time that it's pinged that requests may time out for a minute or two whilst it starts up.

Any problems?  Get in touch: <r.stansfield@voc-8.com>

