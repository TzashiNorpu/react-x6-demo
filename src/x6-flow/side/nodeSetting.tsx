import { Input, Select, Slider, Card, Row, Col } from "antd";
export interface NodeSettingProps {
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
  const onWidthChanged = (width: number) => {
    props.onChange({ k: "width", v: width });
  };
  const onHeightChanged = (height: number) => {
    props.onChange({ k: "height", v: height });
  };

  const onNodeColorChanged = (e: any) => {
    props.onChange({ k: "fill", v: e.target.value });
  };

  const onStrokeWidthChanged = (strokeWidth: number) => {
    props.onChange({ k: "strokeWidth", v: strokeWidth });
  };

  const onStrokeColorChanged = (e: any) => {
    props.onChange({ k: "stroke", v: e.target.value });
  };

  const onStrokeTypeChanged = (strokeDasharray: string) => {
    props.onChange({ k: "strokeDasharray", v: strokeDasharray });
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
            max={200}
            step={1}
            value={props.state.width}
            onChange={onWidthChanged}
          />
        </Col>
        <Col span={1}>
          <div className="slider-value">{props.state.width}</div>
        </Col>
      </Row>
      <Row align="middle">
        <Col span={8}>Node Hieght</Col>
        <Col span={13}>
          <Slider
            min={1}
            max={100}
            step={1}
            value={props.state.height}
            onChange={onHeightChanged}
          />
        </Col>
        <Col span={1}>
          <div className="slider-value">{props.state.height}</div>
        </Col>
      </Row>
      <Row align="middle">
        <Col span={8}>Node Color</Col>
        <Col span={13}>
          <Input
            type="color"
            value={props.state.fill}
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
          <div className="slider-value">{props.state.strokeWidth}</div>
        </Col>
      </Row>

      <Row align="middle">
        <Col span={8}>Stroke Color</Col>
        <Col span={13}>
          <Input
            type="color"
            value={props.state.stroke}
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
            value={props.state.strokeDasharray}
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
