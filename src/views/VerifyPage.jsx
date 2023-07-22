const {
  ArrowBackIcon,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
  CheckCircleIcon,
  NotAllowedIcon,
} = require('@chakra-ui/react');

const React = require('react');
const { useCallback, useEffect, useState } = React;
const { useNavigate } = require('react-router-dom');
const { verifyText } = require('../helpers/crypto');
const { BaseLayout } = require('../layouts/BaseLayout');
const { useMetaMask } = require('metamask-react');

const VerifyPage = () => {
  const [content, setContent] = useState('');
  const [signature, setSignature] = useState(null);
  const { account } = useMetaMask();
  const [address, setAddress] = useState(account || null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const verify = useCallback(async () => {
    if (!signature || !address) return;

    try {
      setSigner(await verifyText(signature, content));
    } catch (err) {
      setError(err);
    }
  }, [content, address, signature]);

  const changeContent = useCallback(
    (event) => setContent(event.target.value),
    []
  );

  const clearError = useCallback(() => {
    setError(null);
    setSignature(null);
  }, []);

  const goBack = useCallback(() => navigate('/'), []);

  const changeSignature = useCallback(
    (ev) => setSignature(ev.target.value),
    []
  );

  const changeAddress = useCallback((ev) => setAddress(ev.target.value), []);

  const resetSigner = useCallback(() => setSigner(null), []);

  useEffect(() => setAddress(account), [account]);

  return (
    <BaseLayout error={error || undefined} onClearError={clearError}>
      <Modal onClose={clearError} isOpen={signature !== null && signer !== null}>
        <ModalOverlay opacity={0.3} />
        <ModalContent>
          <ModalHeader>
            <Heading as="h2" fontSize={'xl'}>
              SIGNATURE
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center h="100%" hidden={address !== signer}>
              <VStack>
                <CheckCircleIcon color="green.200" boxSize={32} p={6} />
                <Heading color="green.200">Verified</Heading>
                <Heading>Signer</Heading>
                <Text>{signer}</Text>
              </VStack>
            </Center>

            <Center h="100%" hidden={address === signer}>
              <VStack>
                <NotAllowedIcon color="red.200" boxSize={32} p={6} />
                <Heading color="red.200">Unverified</Heading>
                <Heading>Signer</Heading>
                <Text>{signer}</Text>
              </VStack>
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button width={'100%'} colorScheme={'blue'} onClick={resetSigner}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Center h="100%">
        <VStack gap={2} maxW="400px" w="100%">
          <Heading as={'h1'} fontSize={'2xl'}>
            VERIFY MESSAGE
          </Heading>

          <FormControl>
            <FormLabel>Address</FormLabel>
            <Input
              placeholder="0x42E4739485FEB64E1CFA467C..."
              value={address || ''}
              onChange={changeAddress}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Signature</FormLabel>
            <Input
              placeholder="f59df66bd01ac0af0f50d000..."
              value={signature || ''}
              onChange={changeSignature}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Message</FormLabel>
            <Textarea
              value={content}
              rows={5}
              onChange={changeContent}
              placeholder="signed message ..."
            />
          </FormControl>
          <HStack>
            <IconButton
              aria-label="go-back"
              onClick={goBack}
              icon={<ArrowBackIcon />}
            />
            <Button
              colorScheme={'green'}
              width={'100%'}
              disabled={
                content.length === 0 ||
                (signature && signature.length !== 132) ||
                (address && address.length !== 42)
              }
              onClick={verify}
            >
              verify
            </Button>
          </HStack>
        </VStack>
      </Center>
    </BaseLayout>
  );
};

module.exports = VerifyPage;
