const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ethers } = require("hardhat");
require("dotenv").config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to extract income information from text
async function extractIncomeFromText(text) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
  Extract income information from the following text. I need:
  1. Total amount earned
  2. Date of the income
  3. Source of income (what job or platform)
  4. Type of work performed
  
  Format the output as follows:
  amount: [amount as a number only]
  date: [date in YYYY-MM-DD format]
  source: [source of income]
  work: [type of work]
  confidence: [high, medium, or low based on certainty of extraction]
  
  Only include these fields in your response, with no additional text or explanation.
  
  Text to analyze: "${text}"
  `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  
  try {
    // Parse the output
    const output = {};
    responseText.split('\n').forEach(line => {
      const [key, value] = line.split(':').map(s => s.trim());
      if (key && value) {
        output[key] = value;
      }
    });
    
    // Convert amount to a number (cents)
    if (output.amount) {
      const amount = parseFloat(output.amount);
      output.amountInCents = Math.round(amount * 100);
    }
    
    return {
      success: output.confidence === 'high' || output.confidence === 'medium',
      data: output
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return { success: false, data: {} };
  }
}

// Function to extract income information from an image (receipt)
async function extractIncomeFromImage(imagePath) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-vision" });

  // In a real implementation, you would load the image and send it to Gemini
  // This is a placeholder for demonstration purposes
  const prompt = `
  Analyze this receipt and extract the following income information:
  1. Total amount earned
  2. Date of the transaction
  3. Source of income (platform or service)
  
  Format the output exactly as follows:
  amount: [amount as a number only]
  date: [date in YYYY-MM-DD format]
  source: [source of income]
  confidence: [high, medium, or low based on how clearly this appears to be income]
  `;

  try {
    // In real implementation, include image data here
    // const result = await model.generateContent([prompt, imageData]);
    
    // Placeholder for demonstration
    console.log("Image analysis would be performed here");
    return { success: false, data: {} };
  } catch (error) {
    console.error("Error processing image:", error);
    return { success: false, data: {} };
  }
}

// Oracle function to verify and update on-chain
async function verifyAndUpdateOnChain(requestId, aiVerifierContract) {
  try {
    // Get request details
    const request = await aiVerifierContract.getRequestDetails(requestId);
    const dataReference = request.dataReference;
    
    // In a real implementation, you would retrieve the data from IPFS or other storage
    // This is a placeholder for demonstration
    const sampleText = "I earned $800 as an Uber driver last week from Jan 10 to Jan 17, 2023, working about 30 hours.";
    
    // Process data with AI
    const { success, data } = await extractIncomeFromText(sampleText);
    
    if (success) {
      const verifiedIncome = data.amountInCents * 10000; // Convert to USDC format (6 decimals)
      const metadataUri = generateMetadataUri(data);
      
      // Update on-chain
      const tx = await aiVerifierContract.fulfillVerification(
        requestId,
        verifiedIncome,
        true,
        metadataUri
      );
      
      await tx.wait();
      console.log(`Successfully verified income for request ${requestId}: $${data.amount}`);
      return true;
    } else {
      // Failed verification
      const tx = await aiVerifierContract.fulfillVerification(
        requestId,
        0,
        false,
        ""
      );
      
      await tx.wait();
      console.log(`Failed to verify income for request ${requestId}`);
      return false;
    }
  } catch (error) {
    console.error("Error in verification process:", error);
    return false;
  }
}

// Generate metadata URI for the passport NFT
function generateMetadataUri(data) {
  // In a real implementation, you would upload this to IPFS or similar storage
  const metadata = {
    name: "Credit Passport",
    description: "Financial identity passport with verified income data",
    image: "https://example.com/credit-passport.png",
    attributes: [
      {
        trait_type: "Income Source",
        value: data.source
      },
      {
        trait_type: "Work Type",
        value: data.work
      },
      {
        trait_type: "Income Amount",
        value: data.amount
      },
      {
        trait_type: "Date",
        value: data.date
      }
    ]
  };
  
  // In real implementation, you would upload this JSON to IPFS and return the URI
  return `ipfs://placeholder/${Date.now()}`;
}

// Example usage (uncomment to use)
/*
async function main() {
  // Connect to the deployed AI verifier contract
  const AIVerifier = await ethers.getContractFactory("AIVerifier");
  const aiVerifier = AIVerifier.attach("YOUR_DEPLOYED_CONTRACT_ADDRESS");
  
  // Monitor for verification requests
  aiVerifier.on("VerificationRequested", async (requestId, user, dataReference) => {
    console.log(`New verification request: ${requestId} from ${user}`);
    await verifyAndUpdateOnChain(requestId, aiVerifier);
  });
  
  console.log("AI Verification oracle is running. Waiting for events...");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
*/

module.exports = {
  extractIncomeFromText,
  extractIncomeFromImage,
  verifyAndUpdateOnChain
}; 