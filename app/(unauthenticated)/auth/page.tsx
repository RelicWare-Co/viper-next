"use client";

import { useState, useEffect, useActionState } from 'react';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Title, 
  Text,
  Paper, 
  Anchor, 
  Stack, 
  Container, 
  Group,
  Box,
  Transition,
  Center,
  Alert, 
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAt, IconLock, IconUser, IconAlertCircle } from '@tabler/icons-react';
import { login, signup } from './actions';

const initialState = {
  message: null,
};

export default function Auth() {
  const [formType, setFormType] = useState<'login' | 'register'>('login');
  const [visible, setVisible] = useState(false);

  const [loginState, loginFormAction] = useActionState(login, initialState);
  const [signupState, signupFormAction] = useActionState(signup, initialState);

  const state = formType === 'login' ? loginState : signupState;
  const formAction = formType === 'login' ? loginFormAction : signupFormAction;

  useEffect(() => {
    setVisible(true);
  }, []);

  const toggleFormType = () => {
    setFormType((current) => (current === 'login' ? 'register' : 'login'));
    form.reset();
  };

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 8 ? 'Password must be at least 8 characters' : null),
      confirmPassword: (value, values) => 
        formType === 'register' && value !== values.password ? 'Passwords do not match' : null,
      name: (value) => (formType === 'register' && !value.trim() ? 'Name is required' : null),
    },
  });

  return (
    <Container size="xs" py="xl">
      <Transition mounted={visible} transition="fade" duration={400} timingFunction="ease">
        {(styles) => (
          <Paper
            radius="md"
            p="xl"
            withBorder
            shadow="md"
            style={{ ...styles }}
            mx="auto"
            bg="var(--mantine-color-body)"
          >
            <Title ta="center" order={2} mb="lg" fw={900}>
              {formType === 'login' ? 'Welcome back!' : 'Create an account'}
            </Title>

            {state?.message && (
              <Alert 
                icon={<IconAlertCircle size="1rem" />} 
                title="Authentication Status" 
                color={state.message.startsWith('Signup successful') ? 'teal' : 'red'} 
                mb="lg" 
                variant="light"
                withCloseButton
                onClose={() => { /* Optionally reset state here */ }}
              >
                {state.message}
              </Alert>
            )}

            <form action={formAction}>
              <Stack>
                {formType === 'register' && (
                  <TextInput
                    id="name"
                    name="name" 
                    required
                    label="Name"
                    placeholder="Your name"
                    radius="md"
                    leftSection={<IconUser size={16} />}
                    {...form.getInputProps('name')}
                    error={form.errors.name}
                  />
                )}

                <TextInput
                  id="email"
                  name="email" 
                  required
                  label="Email"
                  placeholder="hello@example.com"
                  radius="md"
                  leftSection={<IconAt size={16} />}
                  {...form.getInputProps('email')}
                  error={form.errors.email}
                />

                <PasswordInput
                  id="password"
                  name="password" 
                  required
                  label="Password"
                  placeholder="Your password"
                  radius="md"
                  leftSection={<IconLock size={16} />}
                  {...form.getInputProps('password')}
                  error={form.errors.password}
                />

                {formType === 'register' && (
                  <PasswordInput
                    name="confirmPassword" 
                    required
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    radius="md"
                    leftSection={<IconLock size={16} />}
                    {...form.getInputProps('confirmPassword')}
                    error={form.errors.confirmPassword}
                  />
                )}

                {formType === 'login' && (
                  <Group justify="space-between" mt="md">
                    <Anchor size="sm" c="dimmed" href="#" fw={500}>
                      Forgot your password?
                    </Anchor>
                  </Group>
                )}

                <Button 
                  type="submit" 
                  radius="xl" 
                  fullWidth 
                  mt="xl" 
                  size="md"
                  bg="blue.6"
                  c="white"
                  fw={700}
                >
                  {formType === 'login' ? 'Sign in' : 'Create account'}
                </Button>
              </Stack>
            </form>

            <Text ta="center" mt="md">
              {formType === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <Anchor fw={700} onClick={toggleFormType} c="blue.6">
                {formType === 'login' ? 'Create account' : 'Sign in'}
              </Anchor>
            </Text>

            <Box mt="xl" mb="md">
              <Center>
                <Text size="xs" c="dimmed">
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                </Text>
              </Center>
            </Box>
          </Paper>
        )}
      </Transition>
    </Container>
  );
}