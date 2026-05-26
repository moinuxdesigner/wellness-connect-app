<?php

namespace App\Services;

use App\Contracts\SmsVerificationSender;

class DummySmsVerificationSender implements SmsVerificationSender
{
    public function send(string $mobile, string $otp): void
    {
        // Intentionally no external delivery in development. Replace this binding with Twilio later.
    }

    public function providerName(): string
    {
        return 'dummy';
    }
}
