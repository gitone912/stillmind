const db = require('../database');

// Generate a 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in database with 10-minute expiration
function storeOTP(email, otp) {
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Delete any existing OTPs for this email
    const deleteStmt = db.prepare('DELETE FROM otps WHERE email = ?');
    deleteStmt.run(email);

    // Insert new OTP
    const insertStmt = db.prepare(
        'INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)'
    );
    insertStmt.run(email, otp, expiresAt);

    // Log OTP to console for testing
    console.log(`\n========================================`);
    console.log(`OTP for ${email}: ${otp}`);
    console.log(`Expires in 10 minutes`);
    console.log(`========================================\n`);
}

// Verify OTP
function verifyOTP(email, otp) {
    const stmt = db.prepare(
        'SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > ?'
    );
    const result = stmt.get(email, otp, Date.now());

    if (result) {
        // Delete the OTP after successful verification
        const deleteStmt = db.prepare('DELETE FROM otps WHERE email = ?');
        deleteStmt.run(email);
        return true;
    }

    return false;
}

// Clean up expired OTPs (optional, can be called periodically)
function cleanupExpiredOTPs() {
    const deleteStmt = db.prepare('DELETE FROM otps WHERE expires_at < ?');
    const result = deleteStmt.run(Date.now());
    console.log(`Cleaned up ${result.changes} expired OTPs`);
}

module.exports = {
    generateOTP,
    storeOTP,
    verifyOTP,
    cleanupExpiredOTPs
};
