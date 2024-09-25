# Rockets API

Dit is een API genaamd "Rockets" gemaakt door Daniil.

## Documentatie

Voor volledige documentatie van de API, bekijk deze link: https://myrocketapp-34740598b7f1.herokuapp.com/api-docs

## Gedeployde Versie

De API is gedeployed en toegankelijk via de volgende link:
https://myrocketapp-34740598b7f1.herokuapp.com <br/>
De basis url wordt redirect naar de documentatie van de API om zo geen cannot get/ weer te geven.

Deze deployment is gedaan met behulp van Heroku, hiervoor heb je de package nodig heroku.



Om de deployment te updaten/ te deployen voer je het volgende commando uit:
```
git push heroku main
```

Je kunt de gedeployde website ook openen met het volgende commando:
```
heroku open
```

## Testen

Gelieve de testen elk apart uit te voeren. Wanneer je alle testen tegelijk runt, zullen er drie fouten optreden omdat de server al draait op die poort. Dit probleem kon niet worden opgelost met Jest.

### Test Commando's

Gebruik de volgende commando om alle testen uit te voeren:
```
npm test
```

Gebruik de volgende commando's om specifieke testen uit te voeren:

```
npm test agency.test.js
npm test rocket.test.js
```

Enzovoort.

## Admin Account

Je kunt een account met admin rol aanmaken door, naast de login gegevens, een parameter `role` mee te geven in de POST request. Bijvoorbeeld:
```json
{
  "username": "adminUser",
  "password": "password123",
  "role": "admin"
}
```

---
