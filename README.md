# NDHU Elearning Assignment Assistant
Description: A Google Chrome Extension for the National Dong Hwa University (NDHU) [Elearning](http://www.elearn.ndhu.edu.tw/moodle/index.php?lang=en_utf8) website that helps manage assignments and provides notifications regarding upcoming assignment due dates.

Date started: 28th March, 2023.

## Current and Past contributors:
- [Akeem Peters](https://github.com/Ake3m)

- [Tyler Eck](https://github.com/Tylereck81)

- [Astrid Adhipurusa](https://github.com/scarstreet)

## How to install
To install the extension, do the following: 

1. Clone or download the repository.

2. Activate Developer Mode under Google Chrome Extension Management page.

3. Select Load Unpacked.

![image](https://user-images.githubusercontent.com/25711110/228929810-5f1ead29-951d-443c-bd16-7b0b5ecb5c7d.png)

4. Select the cloned repository folder.

## Changes to the NDHU Elearning page

Once installed, a new button will be added to the [NDHU Elearning](http://www.elearn.ndhu.edu.tw/moodle/index.php?lang=en_utf8) website for assignment pages with the words "Track this assignment". This will give the extension the ability to record the assignment in Google Chrome storage and provide the user with notifications when the assignment deadline approaches, ensuring they do not forget.

Before:
![image](https://user-images.githubusercontent.com/25711110/229331704-732849f1-545c-4e39-a056-af1a914d0807.png)
After:
![image](https://user-images.githubusercontent.com/25711110/228928754-e535891d-985a-4f19-9a26-582bc8869c50.png)

## The Graphical User Interface
Once tracked, the assignment will appear in the extension's popup user interface; that can be accessed by clicking the icon under the extensions dropdown (for convenience, pin the extension for easy access). From this interface, the user can see all their tracked assignments, delete tracked assignments to remove it from the list. As mentioned before, any assignment that is tracked here would issue a notification to the user once the deadline is near. 
An example of this can be seen below:

![image](https://user-images.githubusercontent.com/25711110/229470329-cf673fa8-01a2-4c21-a41e-bbc6e20ffc9b.png)

### Convenient Assignment Uploading
Tracked assignments offer convenience in the sense that with a single click, you will be taken to that particular assignment's upload page.

### Completing or Deleting Assignments
If you have completed an assignment and you no longer want to receive notifications regarding it, you can delete the completed assignment from the list. To do so, gently swipe to the left with your mouse which will reveal a delete button. Press the delete button in order to remove the assignment from the list. 

![image](https://user-images.githubusercontent.com/25711110/229470567-ce1f7a89-5efb-417a-ab09-ff875c76e588.png)

### Dark Mode
Dark Mode can be toggled on and off by clicking the icon in the top right corner.
![image](https://user-images.githubusercontent.com/25711110/229975925-c0bc131d-918e-4d45-80eb-89b02ce4029d.png)



## Notifications
The current notification scheme is set to remind users, 24 hours, 12 hours and 1 hour before their tracked assignment is due. The notification will look as follows:

![image](https://user-images.githubusercontent.com/25711110/229331506-0ebf5a33-301e-4d15-bc94-a3b279b5a47a.png)

## Functionality and Features that has been added so far
- Make button appear in the [NDHU Elearning](http://www.elearn.ndhu.edu.tw/moodle/index.php?lang=en_utf8) website's assignment pages.
- Save assignment information when the "Track this assignment" button is clicked. 
- Disallow tracking of assignments if the due date has already passed.
- Automatically remove assignments from tracked list if the due date for the assignment has passed.
- Graphical User Interface design.
- Load and display assignment information in Extensions Graphical User Interface.
- Allow for scrolling of assignments in the Extension's Graphical User Interface.
- Added hover effect for each assignment.
- Manually delete an assignment from the Graphical User Interface. (Slide in order to delete)
- Provide the user with a notification when the due date for an assignment draws near (Currently reminds users 24 hours, 12 hours and 1 hour before the due date).
- Once an assignment is deleted, the alarms also need to be deleted.
- Dark Mode added
## Functionality and Features that need to be added (TODO)
- Make an options page to allow user's to configure notification settings, such as when they should be notified (eg. 2 days before, 1 day before, 5 hours before, etc) as well as notification frequency. (May or may not do)
- Implement a downdown timer for each assignment to display in the Graphical User Interface. (May or may not do)
- Group each assignment by course name and display them in sections (May or may not do)
- Multi-language support?
- Any other feture that might be helpful. 
