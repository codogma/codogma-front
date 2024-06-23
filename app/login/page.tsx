import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";

export default function LoginPage() {
    return (
        <Stack
            component="form"
            sx={{
                width: '25ch',
            }}
            spacing={2}
            noValidate
            autoComplete="off"
        >
            <FormControl variant="standard">
                <InputLabel htmlFor="component-simple">Username or Email</InputLabel>
                <Input id="component-simple"/>
            </FormControl>
            <FormControl variant="standard">
                <InputLabel htmlFor="component-simple">Password</InputLabel>
                <Input id="component-simple"/>
            </FormControl>
            <Button variant="contained">Submit</Button>
        </Stack>
    );
}

