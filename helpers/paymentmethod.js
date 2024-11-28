const mapPaymentMethod = (method) => {
    switch (method) {
        case 'Mpesa':
            return '<i class="fab fa-cc-mpesa me-1"></i> Mpesa';
        case 'Visa':
            return '<i class="fab fa-cc-visa me-1"></i> Visa';
        case 'Mastercard':
            return '<i class="fab fa-cc-mastercard me-1"></i> Mastercard';
        case 'Paypal':
            return '<i class="fab fa-cc-paypal me-1"></i> Paypal';
        default:
            return 'Other';
    }
};

module.exports = mapPaymentMethod;