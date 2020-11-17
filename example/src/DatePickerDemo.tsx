import React, { PureComponent } from "react";
import { Form, Layout, Row, Col } from "antd";
import { FormComponentProps } from "antd/lib/form";
import SingleDatePicker, { RangePicker, SelectMode } from "datepicker-of-antd";
// import "antd/es/date-picker/style/index.css";
import "antd/dist/antd.css";

interface Props extends FormComponentProps {}

interface State {}

class DatePickerDemo extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { form } = this.props;

    const { getFieldDecorator, getFieldValue } = form;

    return (
      <Layout style={{ padding: 20 }}>
        <Form>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="单个时间">
                {getFieldDecorator("singleDate")(<SingleDatePicker />)}
              </Form.Item>
              {JSON.stringify(getFieldValue("singleDate"))}
            </Col>
            <Col span={6}>
              <Form.Item label="单个时间(选择今天及以后)">
                {getFieldDecorator("singleDate1")(
                  <SingleDatePicker selectMode={SelectMode.TODYANDAFTER} />
                )}
              </Form.Item>
              {JSON.stringify(getFieldValue("singleDate1"))}
            </Col>
            <Col span={6}>
              <Form.Item label="单个时间(选择以后)">
                {getFieldDecorator("singleDate2")(
                  <SingleDatePicker selectMode={SelectMode.AFTER} />
                )}
              </Form.Item>
              {JSON.stringify(getFieldValue("singleDate2"))}
            </Col>
            <Col span={6}>
              <Form.Item label="单个时间(选择之前)">
                {getFieldDecorator("singleDate3")(
                  <SingleDatePicker selectMode={SelectMode.BREFORE} />
                )}
              </Form.Item>
              {JSON.stringify(getFieldValue("singleDate3"))}
            </Col>
            <Col span={6}>
              <Form.Item label="单个时间(选择之前及今天)">
                {getFieldDecorator("singleDate4")(
                  <SingleDatePicker selectMode={SelectMode.BREFOREANDTODAY} />
                )}
              </Form.Item>
              {JSON.stringify(getFieldValue("singleDate4"))}
            </Col>
            <Col span={6}>
              <Form.Item label="联级时间">
                {getFieldDecorator("rangeDate")(<RangePicker />)}
              </Form.Item>
              {JSON.stringify(getFieldValue("rangeDate"))}
            </Col>
            <Col span={6}>
              <Form.Item label="联级时间(选择今天及以后)">
                {getFieldDecorator("rangeDate1")(
                  <RangePicker selectMode={SelectMode.TODYANDAFTER} />
                )}
              </Form.Item>
              {JSON.stringify(getFieldValue("rangeDate1"))}
            </Col>
            <Col span={6}>
              <Form.Item label="联级时间(选择以后)">
                {getFieldDecorator("rangeDate2")(
                  <RangePicker selectMode={SelectMode.AFTER} />
                )}
              </Form.Item>
              {JSON.stringify(getFieldValue("rangeDate2"))}
            </Col>
            <Col span={6}>
              <Form.Item label="联级时间(选择之前)">
                {getFieldDecorator("rangeDate3")(
                  <RangePicker selectMode={SelectMode.BREFORE} />
                )}
              </Form.Item>
              {JSON.stringify(getFieldValue("rangeDate3"))}
            </Col>
            <Col span={6}>
              <Form.Item label="联级时间(选择之前及今天)">
                {getFieldDecorator("rangeDate4")(
                  <RangePicker selectMode={SelectMode.BREFOREANDTODAY} />
                )}
              </Form.Item>
              {JSON.stringify(getFieldValue("rangeDate4"))}
            </Col>
            {/* <Col span={8}>
              <Form.Item label="单个时间(带时间)">
                {getFieldDecorator("singleDateTime")(
                  <SingleDatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    selectTodayAfter
                  />
                )}
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item label="联级时间">
                {getFieldDecorator("rangeDateTime")(
                  <RangePicker format="YYYY-MM-DD HH:mm:ss" selectTodayAfter />
                )}
              </Form.Item>
            </Col> */}
          </Row>
        </Form>
      </Layout>
    );
  }
}

export default Form.create({
  onValuesChange(props, changedValues, allValues) {
    console.log(allValues);
  }
})(DatePickerDemo);
