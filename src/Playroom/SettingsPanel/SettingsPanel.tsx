import React, { useContext, type ReactChild } from 'react';
import { Heading } from '../Heading/Heading';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import {
  type ColorScheme,
  type EditorPosition,
  StoreContext,
} from '../../StoreContext/StoreContext';
import { Stack } from '../Stack/Stack';
import EditorRightIcon from '../icons/EditorRightIcon';
import EditorBottomIcon from '../icons/EditorBottomIcon';
import EditorUndockedIcon from '../icons/EditorUndockedIcon';

import * as styles from './SettingsPanel.css';
import ColorModeSystemIcon from '../icons/ColorModeSystemIcon';
import ColorModeLightIcon from '../icons/ColorModeLightIcon';
import ColorModeDarkIcon from '../icons/ColorModeDarkIcon';
import { Text } from '../Text/Text';
import { Inline } from '../Inline/Inline';
import { isMac } from '../../utils/formatting';

const getKeyBindings = () => {
  const metaKeySymbol = isMac() ? '⌘' : 'Ctrl';
  const altKeySymbol = isMac() ? '⌥' : 'Alt';
  const shiftKeySymbol = isMac() ? '⇧' : 'Shift';

  return {
    Find: [metaKeySymbol, 'F'],
    'Find and replace': [metaKeySymbol, altKeySymbol, 'F'],
    'Toggle comment': [metaKeySymbol, '/'],
    'Wrap selection in tag': [metaKeySymbol, shiftKeySymbol, ','],
    'Format code': [metaKeySymbol, 'S'],
    'Insert snippet': [metaKeySymbol, 'K'],
    'Copy Playroom link': [metaKeySymbol, shiftKeySymbol, 'C'],
    'Select next occurrence': [metaKeySymbol, 'D'],
    'Jump to line number': [metaKeySymbol, 'G'],
    'Swap line up': [altKeySymbol, '↑'],
    'Swap line down': [altKeySymbol, '↓'],
    'Duplicate line up': [shiftKeySymbol, altKeySymbol, '↑'],
    'Duplicate line down': [shiftKeySymbol, altKeySymbol, '↓'],
    'Add cursor to prev line': [metaKeySymbol, altKeySymbol, '↑'],
    'Add cursor to next line': [metaKeySymbol, altKeySymbol, '↓'],
  };
};

const positionIcon: Record<EditorPosition, ReactChild> = {
  undocked: <EditorUndockedIcon />,
  right: <EditorRightIcon />,
  bottom: <EditorBottomIcon />,
};

const colorModeIcon: Record<ColorScheme, ReactChild> = {
  light: <ColorModeLightIcon />,
  dark: <ColorModeDarkIcon />,
  system: <ColorModeSystemIcon />,
};

interface KeyboardShortcutProps {
  keybinding: string[];
  description: string;
}

const KeyboardShortcut = ({
  keybinding,
  description,
}: KeyboardShortcutProps) => {
  const shortcutSegments = keybinding.map((segment) => (
    <kbd className={styles.kbd} key={`${keybinding}-${segment}`}>
      {segment}
    </kbd>
  ));

  return (
    <div className={styles.keyboardShortcutRow}>
      <Text>{description}</Text>
      <Text size={isMac() ? 'large' : 'standard'}>
        <Inline space="xxsmall">{shortcutSegments}</Inline>
      </Text>
    </div>
  );
};

export default React.memo(() => {
  const [{ editorPosition, colorScheme }, dispatch] = useContext(StoreContext);

  const keybindings = getKeyBindings();

  return (
    <ToolbarPanel>
      <Stack space="xxxlarge">
        <fieldset className={styles.fieldset}>
          <legend>
            <Heading level="3">Editor Position</Heading>
          </legend>
          <div className={styles.radioContainer}>
            {['Bottom', 'Right'].map((option) => (
              <div key={option}>
                <input
                  type="radio"
                  name="editorPosition"
                  id={`editorPosition${option}`}
                  value={option.toLowerCase()}
                  title={option}
                  checked={option.toLowerCase() === editorPosition}
                  onChange={() =>
                    dispatch({
                      type: 'updateEditorPosition',
                      payload: {
                        position: option.toLowerCase() as EditorPosition,
                      },
                    })
                  }
                  className={styles.realRadio}
                />
                <label
                  htmlFor={`editorPosition${option}`}
                  className={styles.label}
                  title={option}
                >
                  {positionIcon[option.toLowerCase() as EditorPosition]}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>
            <Heading level="3">Color Scheme</Heading>
          </legend>
          <div className={styles.radioContainer}>
            {['Light', 'Dark', 'System'].map((option) => (
              <div key={option}>
                <input
                  type="radio"
                  name="colorScheme"
                  id={`colorScheme${option}`}
                  value={option.toLowerCase()}
                  title={option}
                  checked={option.toLowerCase() === colorScheme}
                  onChange={() =>
                    dispatch({
                      type: 'updateColorScheme',
                      payload: {
                        colorScheme: option.toLowerCase() as ColorScheme,
                      },
                    })
                  }
                  className={styles.realRadio}
                />
                <label
                  htmlFor={`colorScheme${option}`}
                  className={styles.label}
                  title={option}
                >
                  {colorModeIcon[option.toLowerCase() as ColorScheme]}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <Stack space="xlarge">
          <Heading level="3">Keyboard Shortcuts</Heading>
          {Object.entries(keybindings).map(([description, keybinding]) => (
            <KeyboardShortcut
              description={description}
              keybinding={keybinding}
              key={description}
            />
          ))}
        </Stack>
      </Stack>
    </ToolbarPanel>
  );
});
