> Why do I have a folder named ".expo" in my project?
<<<<<<< HEAD

The ".expo" folder is created when an Expo project is started using "expo start" command.


@@ -12,4 +13,12 @@ The ".expo" folder is created when an Expo project is started using "expo start"

No, you should not share the ".expo" folder. It does not contain any information that is relevant for other developers working on the project, it is specific to your machine.

=======
The ".expo" folder is created when an Expo project is started using "expo start" command.
> What do the files contain?
- "devices.json": contains information about devices that have recently opened this project. This is used to populate the "Development sessions" list in your development builds.
- "settings.json": contains the server configuration that is used to serve the application manifest.
> Should I commit the ".expo" folder?
No, you should not share the ".expo" folder. It does not contain any information that is relevant for other developers working on the project, it is specific to your machine.
>>>>>>> f3066d8f334513964a2fef66f4d687565f7f105b
Upon project creation, the ".expo" folder is already added to your ".gitignore" file.