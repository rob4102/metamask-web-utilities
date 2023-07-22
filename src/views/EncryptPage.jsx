const {
  Button,
  Center,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useClipboard,
  VStack,
} = require('@chakra-ui/react');
const React = require('react');
const { useCallback, useState } = React;
const { useNavigate } = require('react-router-dom');
const { encryptText } = require('../helpers/crypto');
const { BaseLayout } = require('../layouts/BaseLayout');
const { ArrowBackIcon } = require('@chakra-ui/icons');

const { useMetaMask } = require('metamask-react');

const EncryptPage = () => {
  const [content, setContent] = useState('');
  const [encrypted, setEncrypted] = useState(null);
  const [error, setError] = useState(null);
  const { onCopy, hasCopied } = useClipboard(encrypted || '');
  const navigate = useNavigate();
  const { account } = useMetaMask();

  const encrypt = useCallback(async () => {
    if (!account) return;

    try {
      const encryptedContent = await encryptText(account, content);
      setEncrypted(encryptedContent);
      setContent(''); // unset secret message
    } catch (err) {
      setEncrypted(null);
      setError(err);
    }
  }, [content, account]);

  const changeContent = useCallback(
    (event) => setContent(event.target.value),
    []
  );

  const goBack = useCallback(() => navigate('/'), []);

  const clear = useCallback(() => {
    setError(null);
    setEncrypted(null);
  }, []);

  return (
    <BaseLayout error={error || undefined} onClearError={clear}>
      <Modal onClose={clear} isOpen={encrypted !== null}>
        <ModalOverlay opacity={0.3} />
        <ModalContent>
          <ModalHeader>
            <Heading as="h2" fontSize={'xl'}>
              ENCRYPTED MESSAGE
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea value={encrypted || ''} rows={10} />
          </ModalBody>
          <ModalFooter>
            <Button
              width={'100%'}
              colorScheme={'green'}
              disabled={hasCopied}
              onClick={onCopy}
            >
              {hasCopied ? 'copied !' : 'copy to clipboard'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Center h="100%">
        <VStack gap={2} maxW="400px" w="100%">
          <Heading as={'h1'} fontSize={'2xl'}>
            ENCRYPT MESSAGE
          </Heading>
          <Textarea
            value={content}
            rows={10}
            onChange={changeContent}
            placeholder="my secret message ..."
          />
          <HStack>
            <IconButton
              aria-label="go-back"
              onClick={goBack}
              icon={<ArrowBackIcon />}
            />
            <Button
              colorScheme={'green'}
              width={'100%'}
              disabled={content.length === 0}
              onClick={encrypt}
            >
              encrypt
            </Button>
          </HStack>
        </VStack>
      </Center>
    </BaseLayout>
  );
};

module.exports = EncryptPage;
