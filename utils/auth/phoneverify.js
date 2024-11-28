function formatPhoneNumber(phoneNumber) {
    // Check if the input contains any non-digit characters
    if (!/^\d+$/.test(phoneNumber)) {
        console.log(phoneNumber);
        console.log(!/^\d+$/.test(phoneNumber));
        console.log("object4444");
        return;
    }
    // Check if the number starts with 0
    if (phoneNumber.startsWith('0')) {
        // Replace leading 0 with 254
        phoneNumber = '254' + phoneNumber.substring(1);
    } else if (phoneNumber.length === 9) {
        // Add 254 at the front if the length is exactly 9
        phoneNumber = '254' + phoneNumber;
    } else {
        // Handle invalid phone numbers or leave unchanged
        console.log('Invalid phone number format');
        return;
    }

    return phoneNumber;
}
module.exports = formatPhoneNumber;