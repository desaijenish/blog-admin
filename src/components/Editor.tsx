import React, { useMemo, useState } from "react";
import YooptaEditor, {
  createYooptaEditor,
  Tools,
  YooptaContentValue,
  YooptaOnChangeOptions,
  YooptaPlugin,
} from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
import ActionMenu, { DefaultActionMenuRender } from "@yoopta/action-menu-list";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import Table from "@yoopta/table";
import Callout from "@yoopta/callout";
import Divider from "@yoopta/divider";
import Accordion from "@yoopta/accordion";
import Code from "@yoopta/code";
import Embed from "@yoopta/embed";
import Image from "@yoopta/image";
import Link from "@yoopta/link";
import File from "@yoopta/file";
import Video from "@yoopta/video";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from "@yoopta/marks";

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];
const TOOLS: Partial<Tools> | any = {
  Toolbar: {
    tool: Toolbar,
    render: DefaultToolbarRender,
  },
  ActionMenu: {
    tool: ActionMenu,
    render: DefaultActionMenuRender,
  },
  LinkTool: {
    tool: LinkTool,
    render: DefaultLinkToolRender,
  },
};

const plugins: YooptaPlugin<any, any>[] = [
  Paragraph,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Table,
  Divider,
  Accordion,
  Code,
  Embed,
  Image,
  Link,
  File,
  Video,
];

const Editor = ({ value, onChange }: any) => {
  const editor = useMemo(() => createYooptaEditor(), []);
  return (
    value && (
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        value={value}
        onChange={onChange}
        tools={TOOLS}
        marks={MARKS}
        style={{width:'100%'}}
      />
    )
  );
};

export default Editor;
