// sms format
// Dear UPI user A/C X5905 debited by 45.0 on date 26Aug23 trf to 7828437107@paytm Refno 323873498413. If not u? call 1800111109. -SBI

export const sendMessage = ({ sms_message }) => {
  const smsText =
    "Dear UPI user A/C X5905 debited by 45.0 on date 26Aug23 trf to 7828437107@paytm Refno 328413. If not u? call 1800111109. -SBI";

  // Regular expressions to extract amount and date
  const amountRegex = /debited by (\d+\.\d+)/;
  const dateRegex = /on date (\d{2}[A-Za-z]{3}\d{2})/;

  // Use match() to find matches in the SMS text
  const amountMatch = smsText.match(amountRegex);
  const dateMatch = smsText.match(dateRegex);

  // Check if matches were found
  if (amountMatch && dateMatch) {
    const amount = amountMatch[1]; // Extracted amount
    const date = dateMatch[1]; // Extracted date
    console.log(`Amount: ${amount}`);
    console.log(`Date: ${date}`);
  } else {
    console.log("Amount or date not found in the SMS text.");
  }
};
