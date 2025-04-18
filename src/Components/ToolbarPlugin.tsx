"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { Button } from "@mantine/core";
export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="toolbar">
      <Button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>Bold</Button>
      <Button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>Italic</Button>
      <Button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}>Underline</Button>
      <Button
        onClick={() => {
          const url = prompt("Enter link URL");
          if (url) {
            document.execCommand("createLink", false, url);
          }
        }}
      >
        Link
      </Button>
    </div>
  );
}
