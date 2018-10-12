import React, { Component } from 'react';
import { Icon, Menu, Layout, Button, Tabs, Modal, Select, Table, Input, Popconfirm, message } from 'antd';
import { Link } from 'react-router-dom';
import { rolelist, roleadd, roledelete } from '../axios';
import moment from 'moment';
import { createForm } from 'rc-form';
import './role.css';

const Option = Select.Option;
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;

class journal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
    this.columns = [{
      title: '角色名称',
      dataIndex: 'name',
    }, {
      title: '角色简写',
      dataIndex: 'value',
    }, {
      title: '角色创建时间',
      dataIndex: 'createTime',
    }, {
      title: '操作',
      dataIndex: 'id',
      render: (text) => {
        return (
          <div>
            <span style={{ marginLeft: '10px' }}>
              <Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(text)}>
                <a href="javascript:;">删除</a>
              </Popconfirm>
            </span>
          </div>
        );
      },
    }
    ];
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  state = { visible: false }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    let rolename = document.getElementById('rolename').value;
    let roleabbr = document.getElementById('roleabbr').value;
    var telrule = /^[a-zA-Z]+$/;
    if(rolename===""){
      message.error('请输入角色名称');
    }else if (!telrule.test(roleabbr)) {
      message.error('请输入正确的英文简写');
      return;
    } else {
      this.props.form.validateFields({ force: true }, (error) => {
        if (!error) {
          roleadd([
            rolename,
            roleabbr,
          ]).then(res => {
            if (res.data && res.data.message === 'success') {
              message.success("设备添加成功");
              setTimeout(() => {
                window.location.href = "/role";
              }, 1000);

            }
          });
        }
      })
      this.setState({
        visible: false,
      });
    }

  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  onDelete = (text, key) => {
    console.log(text)
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        roledelete([
          text,
        ]).then(res => {
          if (res.data && res.data.message === 'success') {
            message.success("信息删除成功");
            const dataSource = [...this.state.data];
            this.setState({
              num: this.state.num - 1,
              dataSource: dataSource.filter(item => item.key !== key)
            });
            setTimeout(() => {
              window.location.href = "/role";
            }, 1000);
          }

        });
      }
    });
  }


  componentWillMount = () => {
    document.title = "角色列表";
    function showTime() {
      let nowtime = new Date();
      let year = nowtime.getFullYear();
      let month = nowtime.getMonth() + 1;
      let date = nowtime.getDate();
      document.getElementById("mytime").innerText = year + "年" + month + "月" + date + " " + nowtime.toLocaleTimeString();
    }
    setInterval(showTime, 1000);

    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        rolelist([
          '',
        ]).then(res => {
          if (res.data && res.data.message === 'success') {
            console.log(res.data.data)
            this.setState({
              data: res.data.data,
              num: res.data.data.length,
            });
          }
        });
      }
    })


  }
  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys > 0;
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
        }),
      };
    });
    return (
      <div id="accountbody" >
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div />
            <div className="Layout-left">
              <Menu
                defaultSelectedKeys={['8']}
                defaultOpenKeys={['sub3']}
                mode="inline"
                theme="dark"
                inlineCollapsed={this.state.collapsed}
              >
                <Menu.Item key="0" style={{ background: '#1890ff', color: 'white', fontSize: "18px", display: "block", width: "94%", borderRadius: '5px', marginLeft: "3%", marginRight: '3%' }}>
                  <Icon type="windows" />
                  <span>水表管理平台</span>
                </Menu.Item>
                <Menu.Item key="0">
                  <Link to="/homepage">
                    <Icon type="bar-chart" />
                    <span>数据概览</span>
                  </Link>
                </Menu.Item>
                <SubMenu key="sub1" title={<span><Icon type="file-text" /><span>信息查询</span></span>}>
                  <Menu.Item key="1"><Link to="/product">产品信息</Link></Menu.Item>
                  <Menu.Item key="3"><Link to="/connector">接口信息</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="desktop" /><span>设备管理</span></span>}>
                  <Menu.Item key="4"><Link to="/basic">基本信息</Link></Menu.Item>
                  <Menu.Item key="5"><Link to="/status">设备状态</Link></Menu.Item>
                  <Menu.Item key="2"><Link to="/parameter">参数设置</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" title={<span><Icon type="user" /><span>用户管理</span></span>}>
                  <Menu.Item key="6"><Link to="/waterman">水务商</Link></Menu.Item>
                  <Menu.Item key="7"><Link to="/account">账户管理</Link></Menu.Item>
                  <Menu.Item key="8"><Link to="/role">角色管理</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub4" title={<span><Icon type="calendar" /><span>日志管理</span></span>}>
                  <Menu.Item key="9"><Link to="/journal">数据日志</Link></Menu.Item>
                  <Menu.Item key="10"><Link to="/datalogs">设备日志</Link></Menu.Item>
                  <SubMenu key="sub5" title={<span>用户日志</span>}>
                    <Menu.Item key="11"><Link to="/userlogs">登入登出</Link></Menu.Item>
                    <Menu.Item key="12"><Link to="/otherlogs">其他日志</Link></Menu.Item>
                  </SubMenu>
                </SubMenu>
                <SubMenu key="sub6" title={<span><Icon type="sync" /><span>生命周期</span></span>}>
                  <Menu.Item key="13"><Link to="/lifecycle">基本信息</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub7" title={<span><Icon type="dashboard" /><span>OTA</span></span>}>
                  <Menu.Item key="15"><Link to="/history">历史记录</Link></Menu.Item>
                  <Menu.Item key="16"><Link to="/operation">操作</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub8" title={<span><Icon type="warning" /><span>产品监控</span></span>}>
                  <Menu.Item key="17"><Link to="/instorage">产品入库</Link></Menu.Item>
                  <Menu.Item key="19"><Link to="/sendout">产品发货</Link></Menu.Item>
                  <Menu.Item key="20"><Link to="/confirm">确认收货</Link></Menu.Item>
                  <Menu.Item key="21"><Link to="/maintenance">产品维修</Link></Menu.Item>
                </SubMenu>
              </Menu>
            </div>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <div style={{ float: 'left' }}>
                <Button type="primary" onClick={this.toggle} style={{ marginLeft: "16px", }}>
                  <Icon
                    className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  />
                </Button>
              </div>
              <span id="mytime" style={{ height: "100%", lineHeight: "64px", display: "inline-block", float: "left", borderRadius: '5px', color: '#333', marginLeft: '20px' }}></span>
              <span style={{ float: 'right', height: '64px', lineHeight: "64px", marginRight: "2%", cursor: 'pointer' }} onClick={this.out}>
                <Icon type="poweroff" style={{ marginRight: '10px' }} />退出
              </span>
              <div className="Administrator">
                <span></span>{localStorage.getItem('realname')}超级管理员
            </div>
            </Header>
            <div className="nav">
              用户管理 / 角色列表
            </div>
            <div className="tit">
              角色列表
            </div>
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
              <div >
                角色类型：<Input placeholder="输入角色类型 / 角色名称" style={{ width: '20%', marginLeft: '10px', marginRight: '40px' }} />
                <Button type="primary" style={{ marginRight: '20px' }} onClick={this.equipmentquery}>查询</Button>
                <Button type="primary" onClick={this.showModal} style={{ marginLeft: '20px', color: 'white', backgroundColor: '#d9534f', borderColor: '#d9534f', }}>
                  新增角色
                </Button>
                <Modal
                  title="添加角色"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  okText="Save"
                >
                  角色名称：<Input placeholder="请输入角色名称" style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }} id="rolename" />
                  角色简写：<Input placeholder="请输入角色名称英文简写" style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }} id="roleabbr" />
                </Modal>
                <Button style={{ marginLeft: '20px', color: 'white', backgroundColor: '#5cb85c', borderColor: '#5cb85c', }}><Link to="/roleassignment">角色分配</Link></Button>
                <Button style={{ marginLeft: '20px', color: 'white', backgroundColor: '#5cb85c', borderColor: '#5cb85c', }}><Link to="/power">权限列表</Link></Button>
                <Button style={{ marginLeft: '20px', color: 'white', backgroundColor: '#5cb85c', borderColor: '#5cb85c', }}><Link to="/powerassignment">权限分配</Link></Button>
              </div>
              <div className="derive">
                <Icon type="info-circle-o" />
                &nbsp; &nbsp;已选择<span style={{ marginLeft: 8, color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>
                  {hasSelected ? `   ${selectedRowKeys.length}  ` : ''}
                </span>条记录
                列表记录总计： <span style={{ color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>{this.state.num}</span> 条
                <Button type="primary" style={{ float: 'right', marginTop: '3px' }}>数据导出</Button>
              </div>
              <div style={{ marginTop: '10px' }}>
                <Table
                  rowSelection={rowSelection}
                  dataSource={this.state.data}
                  columns={columns}
                  rowClassName="editable-row"
                />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    )
  }
}
export default journal = createForm()(journal);

