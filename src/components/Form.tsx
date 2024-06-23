import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';

export default function ComposedTextField() {
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
                <InputLabel htmlFor="component-simple">Username</InputLabel>
                <Input id="component-simple" defaultValue="Username"/>
            </FormControl>
            <FormControl variant="standard">
                <InputLabel htmlFor="component-simple">Email</InputLabel>
                <Input id="component-simple" defaultValue="Email"/>
            </FormControl>
            <FormControl variant="standard">
                <InputLabel htmlFor="component-simple">Password</InputLabel>
                <Input id="component-simple" defaultValue="Password"/>
            </FormControl>
        </Stack>
    );
}