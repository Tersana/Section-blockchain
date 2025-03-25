"use strict";

let blindSignatures = require('blind-signatures');

let SpyAgency = require('./spyAgency.js').SpyAgency;

function makeDocument(coverName) {
  return `The bearer of this signed document, ${coverName}, has full diplomatic immunity.`;
}

function blind(msg, n, e) {
  
  return blindSignatures.blind({
    message: msg,
    N: agency.n,
    E: agency.e,
  });
}

function unblind(blindingFactor, sig, n) {
  return blindSignatures.unblind({
    signed: sig,
    N: n,
    r: blindingFactor,
  });
}


let agency = new SpyAgency();

//
// ***YOUR CODE HERE***
//
// Prepare 10 documents with 10 different cover identities (using the makeDocument function).
let coverNames = [
  "James Bond",
  "Ethan Hunt",
  "Jason Bourne",
  "Natasha Romanoff",
  "Alec Trevelyan",
  "Nikita Mears",
  "Sydney Bristow",
  "Jack Ryan",
  "Carmen Sandiego",
  "Maxwell Smart"
];

let documents = coverNames.map(makeDocument);
let blindResults = documents.map(doc => blind(doc, agency.n, agency.e));
let blindDocs = blindResults.map(result => result.blinded);
let blindingFactors = blindResults.map(result => result.r);


agency.signDocument(blindDocs, (selected, verifyAndSign) => {

  //
  // ***YOUR CODE HERE***
  let factorsForVerification = blindingFactors.map((factor, i) => 
    i === selected ? undefined : factor
  );
  
  let docsForVerification = documents.map((doc, i) => 
    i === selected ? undefined : doc
  );

  // Get the blinded signature for the selected document
  let blindedSig = verifyAndSign(factorsForVerification, docsForVerification);
  
  // Unblind the signature
  let signature = unblind(blindingFactors[selected], blindedSig, agency.n);
  
  // Verify the signature
  let isValid = blindSignatures.verify({
    unblinded: signature,
    N: agency.n,
    E: agency.e,
    message: documents[selected],
  });
  
  if (isValid) {
    console.log(`Successfully obtained valid signature for document ${selected}: ${documents[selected]}`);
  } else {
    console.log("Failed to obtain valid signature");
  }
});