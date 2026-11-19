# Google Play: Μία Νύχτα στο Παλέρμο

Package `com.artemiscodes.palermo`, version 1.1.0, versionCode 1 (local version source, raise `android.versionCode` for every upload). Developer account "Artemis Codes" (organization), console ID 6454968873249867470.

## Status (2026-11-19)

- Android app bundle built on EAS (production profile, build 14e4b3af-5840-4d19-8c9e-53452c6b68ce).
- The app can't be created in Play Console yet: the developer account still has identity verification, trader status, organization website and phone number verification open. Those need Artemis's own details.
- `android.blockedPermissions` removes RECORD_AUDIO (expo-av adds it, the app only plays audio).

## Store listing (default language Greek, plus English)

App name: Μία Νύχτα στο Παλέρμο (30 characters max). English name: One Night in Palermo.

Short description, Greek (80 max): Το παιχνίδι Μαφία, με αφηγητή το κινητό σου. Χωρίς σύνδεση, χωρίς διαφημίσεις.
Short description, English: The Mafia party game, narrated by your phone. Offline and ad-free.

Full description, Greek:

Η Μία Νύχτα στο Παλέρμο είναι η ελληνική εκδοχή του παιχνιδιού Μαφία. Λίγοι παίκτες είναι κρυφά δολοφόνοι, οι υπόλοιποι προσπαθούν να τους βρουν και κάθε μέρα η παρέα ψηφίζει ποιον θα διώξει. Η εφαρμογή παίρνει τη θέση του αφηγητή: μοιράζει τους ρόλους, διαβάζει τη νύχτα φωναχτά και κρατά λογαριασμό ποιος είναι ακόμα ζωντανός, οπότε κανείς δεν χρειάζεται να μείνει εκτός παιχνιδιού.

Παίζετε όλοι με ένα κινητό, το οποίο περνάει από χέρι σε χέρι για να δει ο καθένας τον ρόλο του. Κάθε παιχνίδι έχει έναν Κρυφό Δολοφόνο, έναν Φανερό Δολοφόνο και έναν Ντετέκτιβ, και οι υπόλοιποι είναι Πολίτες. Από τις ρυθμίσεις μπορείτε να προσθέσετε τον Γιατρό, τον Πληροφοριοδότη και τους Εραστές. Χρειάζονται τουλάχιστον 5 παίκτες.

Η αφήγηση είναι ηχογραφημένη στα ελληνικά και στα αγγλικά. Η εφαρμογή δεν χρειάζεται σύνδεση στο ίντερνετ ή λογαριασμό, δεν έχει διαφημίσεις και δεν συλλέγει κανένα στοιχείο.

Full description, English:

One Night in Palermo is the Greek version of the party game Mafia. A few players are secretly killers, everyone else tries to find them, and each day the group votes someone out. The app takes the place of the narrator: it hands out the roles, reads the night out loud and keeps track of who is still alive, so nobody has to sit out to run the game.

Everyone plays on one phone that gets passed around so each person can see their role. Every game has a Hidden Killer, a Revealed Killer and a Detective, and everyone else is a Citizen. In settings you can add the Doctor, the Informant and the Lovers. You need at least 5 players.

The narration is recorded in Greek and English. The app needs no internet connection or account, has no ads and collects no data.

Check these against PRODUCT.md and the iOS listing before publishing, I wrote them from the README.

## Graphics (in this folder)

- `feature-graphic.png`, 1024 x 500.
- `screenshots-en/`, six phone screenshots, 1080 x 2160 (the iOS ones padded to Play's 2:1 limit). They show the English UI; for the Greek listing retake them in Greek, the current ones in `assets/screenshots` are the ones used on iOS.
- Icon: `assets/images/icon.png` is 1024 x 1024, Play wants 512 x 512 PNG, resize on upload.

## Links

- Privacy policy: https://artemiscodes.com/palermo/privacy-policy.html (live, HTTP 200)
- Support: https://artemiscodes.com/palermo/support.html (live, HTTP 200)
- Contact email: artemis.leona@gmail.com

## Answers for the Play Console forms

- Free app, no in-app products, no ads: Contains ads = No.
- App access: all functionality available without login or special access.
- Data safety: no data collected, no data shared; no data deletion needed; the app has no accounts.
- Content rating (IARC questionnaire): category "Game", no violence beyond an abstract mystery theme of a role being "killed" in a party game (answer the violence question honestly, expect a Teen/PEGI 12-ish rating), no sexual content, no gambling, no user interaction, no location sharing, no purchases.
- Target audience: 13 and over (not designed for children).
- Declarations: not a news app, not a government app, no health features, no financial features, no COVID-19 features.
- Category: Games, Party (or Board). Tags up to the console's suggestions.
- Countries: all.
- Closed testing: organization accounts don't need the 12-tester, 14-day test (that rule is for personal accounts created after 13 Nov 2023). Confirm in the Console's dashboard once created.
