import { Input, Select, Slider, Card, Row, Col } from "antd";
import { useState } from "react";
export interface NodeSettingProps {
  onGridSizeChange: (size: number) => void;
  onChange: (res: any) => void;
  state: NodeState;
}

export interface NodeState {
  width?: number;
  height?: number;
  fill?: string; // fill
  strokeWidth?: number; // strokeWidth
  strokeDasharray?: string; // strokeDasharray
  stroke?: string; // stroke
}

export const NodeSettings = (props: NodeSettingProps) => {
  const [state, setState] = useState(props.state);

  const onWidthChanged = (width: number) => {
    setState({ ...state, width });
    props.onChange(state.width);
  };
  const onHeightChanged = (height: number) => {
    setState({ ...state, height });
    props.onChange(state.height);
  };

  const onNodeColorChanged = (e: any) => {
    setState({ ...state, fill: e.target.value });
    props.onChange(state.fill);
  };

  const onStrokeWidthChanged = (strokeWidth: number) => {
    setState({ ...state, strokeWidth });
    props.onChange(state.strokeWidth);
  };

  const onStrokeColorChanged = (e: any) => {
    setState({ ...state, stroke: e.target.value });
    props.onChange(state.stroke);
  };

  const onStrokeTypeChanged = (strokeType: string) => {
    setState({ ...state, strokeDasharray: strokeType });
    props.onChange(state.strokeDasharray);
  };

  return (
    <Card
      title="Node Settings"
      size="small"
      bordered={false}
      style={{ width: 320 }}
    >
      <Row align="middle">
        <Col span={8}>Node Width</Col>
        <Col span={13}>
          <Slider
            min={1}
            max={20}
            step={1}
            value={props.state.width}
            onChange={onWidthChanged}
          />
        </Col>
        <Col span={1}>
          <div className="slider-value">{state.width}</div>
        </Col>
      </Row>
      <Row align="middle">
        <Col span={8}>Node Hieght</Col>
        <Col span={13}>
          <Slider
            min={1}
            max={20}
            step={1}
            value={props.state.height}
            onChange={onHeightChanged}
          />
        </Col>
        <Col span={1}>
          <div className="slider-value">{state.height}</div>
        </Col>
      </Row>
      <Row align="middle">
        <Col span={8}>Node Color</Col>
        <Col span={13}>
          <Input
            type="color"
            value={state.fill}
            style={{ width: "100%" }}
            onChange={onNodeColorChanged}
          />
        </Col>
      </Row>

      <Row align="middle">
        <Col span={8}>Stroke Width</Col>
        <Col span={13}>
          <Slider
            min={1}
            max={20}
            step={1}
            value={props.state.strokeWidth}
            onChange={onStrokeWidthChanged}
          />
        </Col>
        <Col span={1}>
          <div className="slider-value">{state.strokeWidth}</div>
        </Col>
      </Row>

      <Row align="middle">
        <Col span={8}>Stroke Color</Col>
        <Col span={13}>
          <Input
            type="color"
            value={state.stroke}
            style={{ width: "100%" }}
            onChange={onStrokeColorChanged}
          />
        </Col>
      </Row>
      <Row align="middle">
        <Col span={8}>Stroke Type</Col>
        <Col span={13}>
          <Select
            style={{ width: "100%" }}
            value={state.strokeDasharray}
            onChange={onStrokeTypeChanged}
          >
            <Select.Option value="">
              <svg height="2px" width="100%">
                <g fill="none" stroke="black" strokeWidth="2">
                  <path d="m0,0 l200,0" />
                </g>
              </svg>
            </Select.Option>
            <Select.Option value="5, 5">
              <svg height="2px" width="100%">
                <g fill="none" stroke="black" strokeWidth="2">
                  <path strokeDasharray="5,5" d="m0,0 l200,0" />
                </g>
              </svg>
            </Select.Option>
            <Select.Option value="15, 10, 5, 10">
              <svg height="2px" width="100%">
                <g fill="none" stroke="black" strokeWidth="2">
                  <path strokeDasharray="15, 10, 5, 10" d="m0,0 l200,0" />
                </g>
              </svg>
            </Select.Option>
          </Select>
        </Col>
      </Row>
    </Card>
  );
};
