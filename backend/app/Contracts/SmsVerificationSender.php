<?php

namespace App\Contracts;

interface SmsVerificationSender
{
    public function send(string $mobile, string $otp): void;

    public function providerName(): string;
}
