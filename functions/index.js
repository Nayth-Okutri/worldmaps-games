/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
require("dotenv").config();
const {setGlobalOptions} = require("firebase-functions");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const {
  onDocumentUpdated,
  onDocumentCreated,
} = require("firebase-functions/v2/firestore");

const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
exports.onSightingsApproved = onDocumentUpdated(
    "sightings/{id}",
    async (event) => {
      const before = event.data.before.data();
      const after = event.data.after.data();

      if (!before.approved && after.approved) {
        const email = after.email;
        if (!email) return;

        const msg = {
          to: email,
          from: "contact@nayth.art",
          subject: "Merci pour ton message ✨",
          text: "Voici ton cadeau",
          html: `
          <p>Merci pour ton message ✨</p>
          <p>Voici ton PDF :</p>
          <a href="https://u.pcloud.link/publink/show?code=XZRatE5Z2aHknASsSJBYAgdbqtugcRfgioCV">
            Télécharger
          </a>
        `,
        };

        try {
          await sgMail.send(msg);
          console.log("Email envoyé à", email);
        } catch (error) {
          console.error("Erreur SendGrid:", error);
        }
      }
    },
);

exports.alertNewSighting = onDocumentCreated(
    "sightings/{id}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) return;

      const data = snapshot.data();
      const curatorUrl = "https://nayth.art/worldmaps/curator";

      const htmlContent = [
        "<div>",
        `<h3>Observation : ${data.name}</h3>`,
        `<p><strong>Message :</strong> ${data.message}</p>`,
        `<p><strong>Mail :</strong> ${data.email}</p>`,
        "<hr>",
        `<a href="${curatorUrl}" `,
        "style=\"background:#1a2a44;color:#fff;padding:10px;\">",
        "OUVRIR LE REGISTRE</a>",
        "</div>",
      ].join("");
      const msg = {
        to: "nayth.sphere@gmail.com", // Ton email où tu veux recevoir l'alerte
        from: "contact@nayth.art",
        subject: "Nouvelle relique à approuver !",
        text: `Un nouveau post de ${data.name} attend ton approbation.`,
        html: htmlContent,
      };

      try {
        await sgMail.send(msg);
        console.log("Alerte admin envoyée !");
      } catch (error) {
        console.error("Erreur envoi alerte admin:", error);
      }
    },
);
