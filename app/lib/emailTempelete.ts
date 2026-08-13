// utils/email-template.ts

import { marked } from "marked";

export async function getEmailTemplate({
    name,
    body,
}: {
    name: string;
    body: string;
}) {
    const htmlBody = await marked.parse(body);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>schemae</title>
</head>

<body style="
    margin:0;
    padding:40px 20px;
    background:#f4f7fb;
    font-family:Arial,Helvetica,sans-serif;
">

<table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
>
<tr>
<td align="center">

<table
    role="presentation"
    width="680"
    cellspacing="0"
    cellpadding="0"
    border="0"
    style="
        background:#ffffff;
        border-radius:20px;
        overflow:hidden;
        border:1px solid #e5e7eb;
    "
>

<!-- Header -->

<tr>
<td
    style="
        background:#2569b5;
        padding:22px 30px;
    "
>

<table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
>

<tr>

<!-- Logo -->

<td width="60" valign="middle">

<div
    style="
        width:50px;
        height:50px;
        border-radius:50%;
        overflow:hidden;
        background:#ffffff;
        text-align:center;
    "
>

<img
    src="https://schemae.vercel.app/logo.png"
    alt="schemae"
    width="50"
    height="50"
    style="
        display:block;
        width:50px;
        height:50px;
        border-radius:50%;
        object-fit:cover;
    "
/>

</div>

</td>

<!-- Title -->

<td
    valign="middle"
    style="
        padding-left:16px;
    "
>

<div
    style="
        color:#ffffff;
        font-size:24px;
        font-weight:700;
        line-height:1.2;
    "
>
Schemae
</div>

<div
    style="
        color:#cbd5e1;
        font-size:14px;
        margin-top:4px;
    "
>
Your Smart Study Companion
</div>

</td>

</tr>

</table>

</td>
</tr>

<!-- Greeting -->

<tr>
<td style="padding:45px 45px 20px;">

<p
style="
margin:0;
font-size:24px;
color:#111827;
font-weight:bold;
">
Hey ${name} 👋
</p>

<p
style="
margin-top:12px;
font-size:16px;
color:#6b7280;
line-height:1.7;
">
Hope you're having a great day.
</p>

</td>
</tr>

<!-- Content -->

<tr>
<td
style="
padding:0 45px 40px;
font-size:16px;
line-height:1.8;
color:#374151;
">
${htmlBody}

- The Schemae Team
</td>
</tr>

<!-- Divider -->

<tr>
<td
style="
border-top:1px solid #e5e7eb;
">
</td>
</tr>

<!-- Footer -->

<tr>
<td
align="center"
style="
padding:35px;
background:#fafafa;
"
>

<p
style="
margin:12px 0;
color:#6b7280;
font-size:14px;
line-height:1.6;
"
>
Be consistent, stay focused, and achieve your goals with Schemae.
</p>

<p
style="
margin:20px 0 0;
font-size:13px;
color:#9ca3af;
"
>
© 2026 Schemae. All rights reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
}