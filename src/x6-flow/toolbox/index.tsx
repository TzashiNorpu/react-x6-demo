import styled from "@emotion/styled";
import {
  AlignmentHorizontalCenter,
  CopyOne,
  Delete,
  ExternalTransmission,
  Group,
  HorizontallyCentered,
  InternalTransmission,
  MinusTheBottom,
  MinusTheTop,
  Notepad,
  Redo,
  Undo,
  Ungroup,
  UploadPicture,
  ZoomIn,
  ZoomOut,
} from "@icon-park/react";
import { Tooltip, Upload, UploadProps } from "antd";
export const ToolBox = ({
  uploadProps,
  onCopy,
  onPaste,
  onRedo,
  onUndo,
  onGraphCenter,
  onContentCenter,
  onToFront,
  onToBack,
  onZoomIn,
  onZoomOut,
  onDelete,
  onGroup,
  onUnGroup,
  undoDisable,
  redoDisable,
  onExportJPEG,
  onExportJson,
}: // onImportJson,
{
  uploadProps: UploadProps;
  onCopy: () => void;
  onPaste: () => void;
  onRedo: () => void;
  onUndo: () => void;
  onGraphCenter: () => void;
  onContentCenter: () => void;
  onToFront: () => void;
  onToBack: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onDelete: () => void;
  onGroup: () => void;
  onUnGroup: () => void;
  undoDisable: boolean;
  redoDisable: boolean;
  onExportJPEG: () => void;
  onExportJson: () => void;
  // onImportJson: () => void;
}) => {
  const iconSize = 25;
  const theme = "outline";
  const fill = "#333";
  const strokeWidth = 3;
  const strokeLinejoin = "miter";

  return (
    <Container>
      <Tooltip key="copy" title="复制">
        <Command
          data-command="copy"
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
        >
          <CopyOne
            theme={theme}
            size={iconSize}
            fill={fill}
            strokeWidth={strokeWidth}
            strokeLinejoin={strokeLinejoin}
          />
        </Command>
      </Tooltip>
      <Tooltip key="paste" title="粘贴">
        <Command
          data-command="paste"
          aria-disabled={undoDisable}
          onClick={(e) => {
            e.stopPropagation();
            onPaste();
          }}
        >
          <Notepad
            theme={theme}
            size={iconSize}
            fill={fill}
            strokeWidth={strokeWidth}
            strokeLinejoin={strokeLinejoin}
          />
        </Command>
      </Tooltip>
      <Tooltip key="redo" title="恢复">
        <CommandBtn
          data-command="redo"
          disabled={redoDisable}
          onClick={(e) => {
            e.stopPropagation();
            onRedo();
          }}
        >
          <Redo
            theme={theme}
            size={iconSize}
            fill={fill}
            strokeWidth={strokeWidth}
            strokeLinejoin={strokeLinejoin}
          />
        </CommandBtn>
      </Tooltip>
      <Tooltip key="undo" title="撤销">
        <CommandBtn
          data-command="undo"
          disabled={undoDisable}
          onClick={(e) => {
            e.stopPropagation();
            onUndo();
          }}
        >
          <Undo
            theme={theme}
            size={iconSize}
            fill={fill}
            strokeWidth={strokeWidth}
            strokeLinejoin={strokeLinejoin}
          />
        </CommandBtn>
      </Tooltip>
      <Separator />
      <Tooltip key="autoFit" title="内容居中">
        <Command
          data-command="autoFit"
          onClick={(e) => {
            e.stopPropagation();
            onContentCenter();
          }}
        >
          <AlignmentHorizontalCenter
            theme={theme}
            size={iconSize}
            fill={fill}
            strokeWidth={strokeWidth}
            strokeLinejoin={strokeLinejoin}
          />
        </Command>
      </Tooltip>
      <Tooltip key="zoomReset" title="画布居中">
        <Command
          data-command="zoomReset"
          onClick={(e) => {
            e.stopPropagation();
            onGraphCenter();
          }}
        >
          <HorizontallyCentered
            theme={theme}
            size={iconSize}
            fill={fill}
            strokeWidth={strokeWidth}
            strokeLinejoin={strokeLinejoin}
          />
        </Command>
      </Tooltip>
      <Tooltip key="toFront" title="向上一层">
        <Command
          data-command="toFront"
          onClick={(e) => {
            e.stopPropagation();
            onToFront();
          }}
        >
          <MinusTheTop
            theme={theme}
            size={iconSize}
            fill={fill}
            strokeWidth={strokeWidth}
            strokeLinejoin={strokeLinejoin}
          />
        </Command>
      </Tooltip>
      <Tooltip key="toBack" title="向下一层">
        <Command
          data-command="toBack"
          onClick={(e) => {
            e.stopPropagation();
            onToBack();
          }}
        >
          <MinusTheBottom
            theme={theme}
            size={iconSize}
            fill={fill}
            strokeWidth={strokeWidth}
            strokeLinejoin={strokeLinejoin}
          />
        </Command>
      </Tooltip>
      <Separator />
      <Tooltip key="group" title="组合">
        <Command
          data-command="group"
          onClick={(e) => {
            e.stopPropagation();
            onGroup();
          }}
        >
          <Group
            theme={theme}
            size={iconSize}
            fill={fill}
            strokeWidth={strokeWidth}
            strokeLinejoin={strokeLinejoin}
          />
        </Command>
      </Tooltip>
      <Tooltip key="ungroup" title="取消组合">
        <Command
          data-command="ungroup"
          onClick={(e) => {
            e.stopPropagation();
            onUnGroup();
          }}
        >
          <Ungroup theme={theme} size={iconSize} fill={fill} />
        </Command>
      </Tooltip>
      <Tooltip key="zoomIn" title="缩小">
        <Command
          data-command="zoomIn"
          onClick={(e) => {
            e.stopPropagation();
            onZoomIn();
          }}
        >
          <ZoomOut
            theme={theme}
            size={iconSize}
            fill={fill}
            strokeWidth={strokeWidth}
            strokeLinejoin={strokeLinejoin}
          />
        </Command>
      </Tooltip>
      <Tooltip key="zoomOut" title="放大">
        <Command
          data-command="zoomOut"
          onClick={(e) => {
            e.stopPropagation();
            onZoomOut();
          }}
        >
          <ZoomIn
            theme={theme}
            size={iconSize}
            fill={fill}
            strokeWidth={strokeWidth}
            strokeLinejoin={strokeLinejoin}
          />
        </Command>
      </Tooltip>
      <Tooltip key="delete" title="删除">
        <Command
          data-command="delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Delete
            theme={theme}
            size={iconSize}
            fill={fill}
            strokeWidth={strokeWidth}
            strokeLinejoin={strokeLinejoin}
          />
        </Command>
      </Tooltip>
      <Separator />
      <Tooltip key="export" title="导出JSON">
        <Command
          data-command="export"
          onClick={(e) => {
            e.stopPropagation();
            onExportJson();
          }}
        >
          <ExternalTransmission
            theme={theme}
            size={iconSize}
            fill={fill}
            strokeWidth={strokeWidth}
            strokeLinejoin={strokeLinejoin}
          />
        </Command>
      </Tooltip>
      <Tooltip key="import" title="导入SON">
        <Command
          data-command="import"
          onClick={(e) => {
            e.stopPropagation();
            // onImportJson();
          }}
        >
          <Upload {...uploadProps}>
            <InternalTransmission
              theme={theme}
              size={iconSize}
              fill={fill}
              strokeWidth={strokeWidth}
              strokeLinejoin={strokeLinejoin}
            />
          </Upload>
        </Command>
      </Tooltip>
      <Tooltip key="export-jpeg" title="导出图片">
        <Command
          data-command="export-jpeg"
          onClick={(e) => {
            e.stopPropagation();
            onExportJPEG();
          }}
        >
          <UploadPicture
            theme={theme}
            size={iconSize}
            fill={fill}
            strokeWidth={strokeWidth}
            strokeLinejoin={strokeLinejoin}
          />
        </Command>
      </Tooltip>
    </Container>
  );
};

const Container = styled(Tooltip)``;

const Command = styled.span`
  display: inline-block;
  border: 1px solid rgba(2, 2, 2, 0);
  border-radius: 2px;
  height: 30px;
  span {
    margin: 0 6px;
  }
  &:nth-of-type(1) {
    margin-left: 6px;
  }
  &:hover {
    border: 1px solid #e9e9e9;
    cursor: pointer;
  }
`;

const CommandBtn = styled.button`
  display: inline-block;
  border: 1px solid rgba(2, 2, 2, 0);
  border-radius: 2px;
  height: 30px;
  span {
    margin: 0 6px;
  }
  &:nth-of-type(1) {
    margin-left: 6px;
  }
  &:hover {
    border: 1px solid #e9e9e9;
    cursor: pointer;
  }
`;

const Separator = styled.span`
  margin: 6px;
  display: inline-block;
  height: 20px;
  border-left: 2px solid #e9e9e9;
  vertical-align: bottom;
`;
