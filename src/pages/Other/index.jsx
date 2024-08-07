import {useEffect, useState} from "react";
import {Button, Input, Space, Table, Modal, Form, notification, Spin, Tag, Popconfirm, Tooltip} from 'antd';
import {Layout, Card} from 'antd';
import {exportToExcel,} from "@utils"
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined, EyeInvisibleOutlined, EyeOutlined, ReloadOutlined,
    SyncOutlined,
    UploadOutlined
} from "@ant-design/icons";
import getOtherData from "@utils/getOther/main.js";
import './index.css'

const {TextArea} = Input;
const {Content} = Layout;
const Other = () => {
    const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
    const [batchLoading, setBatchLoading] = useState(false);
    const [data, setData] = useState([]);
    const [batchForm] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    let idCounter = data.length + 1;
    const [initialized, setInitialized] = useState(false);
    const [hideColumn, setHideColumn] = useState(true);
    const toggleHideColumn = () => {
        setHideColumn(!hideColumn);
    };
    const getEyeIcon = () => {
        if (hideColumn) {
            return <EyeInvisibleOutlined/>;
        }
        return <EyeOutlined/>;
    };
    useEffect(() => {
        setTableLoading(true);

        const storedAddresses = localStorage.getItem('Other_addresses');
        setTimeout(() => {
            setTableLoading(false);
        }, 500);

        if (storedAddresses) {
            setData(JSON.parse(storedAddresses));
        }

        setInitialized(true);
    }, []);

    useEffect(() => {
        if (!initialized) return;

        localStorage.setItem('Other_addresses', JSON.stringify(data));
    }, [data, initialized]);

    const columns = [
        {
            title: "#",
            key: "index",
            align: "center",
            render: (text, record, index) => index + 1,
        },
        {
            title: "备注",
            dataIndex: "name",
            key: "name",
            align: "center",
            className: "name",
            render: (text, record) => {
                const displayText = text || <EditOutlined/>;
                return (
                    <Popconfirm
                        title={
                            <div>
                                <Input
                                    placeholder={"请输入备注"}
                                    defaultValue={text}
                                    onChange={(e) => {
                                        record.name = e.target.value
                                    }}
                                    allowClear
                                    bordered
                                />
                            </div>
                        }
                        icon={<EditOutlined/>}
                        onConfirm={() => {
                            setData([...data]);
                            localStorage.setItem('Other_addresses', JSON.stringify(data));
                        }}
                        onCancel={() => {
                        }}
                        okText={"确定"}
                        cancelText={"取消"}
                    >
                        <Tag color="blue" style={{cursor: "pointer"}}>
                            {displayText}
                        </Tag>
                    </Popconfirm>
                );
            }
        },
        {
            title: <span>
                钱包地址
                <span onClick={toggleHideColumn} style={{marginLeft: 8, cursor: 'pointer'}}>
                        {getEyeIcon()}
                    </span>
                </span>,
            dataIndex: 'address',
            key: 'address',
            align: 'center',
            className: 'address',
            render: (text, record) => {
                if (hideColumn) {
                    return <a href={`https://debank.com/profile/${record.address}`} target="_blank">{text.slice(0, 4) + '***' + text.slice(-4)} </a>;
                }
                return text;
            },
        },
        {
            title: "一些项目-持续添加中",
	    className: "TOP",
            children: [
                {
                    title: "LXP-L",
		    className: "LXP-L",
                    children: [
                        {
                            title: "总积分",
                            dataIndex: ["xp", "lxp"],
                            align: "center",
                            render: (text, record) => text,
                            sorter: (a, b) => a.xp.lxp - b.xp.lxp,
                        },
                        {
                            title: "排名",
                            dataIndex: ["xp", "rank_xp"],
                            align: "center",
                            render: (text, record) => text,
			    sorter: (a, b) => a.xp.rank_xp - b.xp.rank_xp,
                        },
                    ]
                },
                {
                    title: "Scroll",
		    className: "Sessions",
		    align: "center",
                    children: [
			{
			    title: "总积分",
			    dataIndex: "sessions",
			    key: "Scroll_eth_sessions",
			    align: "center",
			    render: (text, record) => text,
			    sorter: (a, b) => a.sessions - b.sessions,
			},
                    ]
                },
                {
                    title: "ether",
		    className: "ether",
		    align: "center",
                    children: [
                        {
                            title: "忠诚度积分",
                            dataIndex: ["ether", "totalIntegrationLoyaltyPoints"],
                            align: "center",
                            render: (text, record) => text,
                            sorter: (a, b) => a.ether.totalIntegrationLoyaltyPoints - b.ether.totalIntegrationLoyaltyPoints,
                        },
                        {
                            title: "特征层点",
                            dataIndex: ["ether", "totalIntegrationEigenLayerPoints"],
                            align: "center",
                            render: (text, record) => text,
			    sorter: (a, b) => a.ether.totalIntegrationEigenLayerPoints - b.ether.totalIntegrationEigenLayerPoints,
                        },
                    ]
                },
                {
                    title: "renzo",
		    className: "renzo",
		    align: "center",
                    children: [
                        {
                            title: "总积分",
                            dataIndex: ["renzo", "renzoPoints"],
                            align: "center",
                            render: (text, record) => text,
                            sorter: (a, b) => a.renzo.renzoPoints - b.renzo.renzoPoints,
                        },
                        {
                            title: "特征层点",
                            dataIndex: ["renzo", "eigenLayerPoints"],
                            align: "center",
                            render: (text, record) => text,
			    sorter: (a, b) => a.renzo.eigenLayerPoints - b.renzo.eigenLayerPoints,
                        },
                    ]
                },
                {
                    title: "kelp DAO",
		    className: "kelpdao",
		    align: "center",
                    children: [
                        {
                            title: "海带大里程",
                            dataIndex: ["kelpdao", "kelpMiles"],
                            align: "center",
                            render: (text, record) => text,
                            sorter: (a, b) => a.kelpdao.kelpMiles - b.kelpdao.kelpMiles,
                        },
                        {
                            title: "特征层点",
                            dataIndex: ["kelpdao", "elPoints"],
                            align: "center",
                            render: (text, record) => text,
			    sorter: (a, b) => a.kelpdao.elPoints - b.kelpdao.elPoints,
                        },
                    ]
                },
                {
                    title: "Lista DAO",
		    className: "lista",
		    align: "center",
                    children: [
                        {
                            title: "总积分",
                            dataIndex: ["lista", "quest"],
                            align: "center",
                            render: (text, record) => text,
                            sorter: (a, b) => a.lista.quest - b.lista.quest,
                        },
                        {
                            title: "排名",
                            dataIndex: ["lista", "position"],
                            align: "center",
                            render: (text, record) => text,
			    sorter: (a, b) => a.lista.position - b.lista.position,
                        },
                    ]
                },
                {
                    title: "FUEL",
		    className: "fuel",
		    align: "center",
                    children: [
                        {
                            title: "总积分",
                            dataIndex: ["fuel", "Points"],
                            align: "center",
                            render: (text, record) => text,
                            sorter: (a, b) => a.fuel.Points - b.fuel.Points,
                        },
                        {
                            title: "排名",
                            dataIndex: ["fuel", "Rank"],
                            align: "center",
                            render: (text, record) => text,
			    sorter: (a, b) => a.fuel.Rank - b.fuel.Rank,
                        },
                    ]
                },
                {
                    title: "karak",
		    className: "karak",
		    align: "center",
                    children: [
                        {
                            title: "总积分",
                            dataIndex: ["karak", "xp"],
                            align: "center",
                            render: (text, record) => text,
                            sorter: (a, b) => a.karak.xp - b.karak.xp,
                        }
                    ]
                },
                {
                    title: "状态",
                    key: "result",
                    align: "center",
                    render: (text, record) => (
                        <Space>
                            {record['result'] === "success" ?
                                <Tag icon={<CheckCircleOutlined/>} color="success">成功</Tag> : null}
                            {record['result'] === "error" ?
                                <Tooltip title={record['reason']}>
                                    <Tag icon={<CloseCircleOutlined/>} color="error">失败 </Tag>
                                </Tooltip> : null}
                            {record['result'] === "pending" ?
                                <Tag icon={<SyncOutlined spin/>} color="processing">获取中 </Tag> : null}
                        </Space>
                    )
                },
                {
                    title: "操作",
                    key: "action",
                    align: "center",
                    render: (text, record) => (
                        <Space>
                            <Popconfirm title={"确认删除？"} onConfirm={async () => {
                                await handleDelete(record.address)
                            }}>
                                <Button icon={<DeleteOutlined/>}/>
                            </Popconfirm>
                            <Button icon={<ReloadOutlined/>} onClick={() => {
                                handleRefresh(record.key)
                            }}/>
                        </Space>
                    )
                }
            ]
        },
    ];
    const handleDelete = async (address) => {
        setData(data.filter(item => item.address !== address));
        localStorage.setItem('Other_addresses', JSON.stringify(data.filter(item => item.address !== address)));
    }
    const handleBatchOk = async () => {
        try {
            setBatchLoading(true);
            setIsBatchModalVisible(false);
            const values = await batchForm.validateFields();
            const addresses = values.addresses.split("\n");

            const limit = 2;
            let activePromises = 0;
            let promisesQueue = [];

            const processQueue = () => {
                while (promisesQueue.length > 0 && activePromises < limit) {
                    const promise = promisesQueue.shift();
                    activePromises += 1;

                    promise().finally(() => {
                        activePromises -= 1;
                        processQueue();
                    });
                }
            };

            for (let address of addresses) {
                address = address.trim();
                if (!address.startsWith("0x")) {
                    address = "0x" + address;
                }

                const promiseFunction = () => new Promise(async (resolve, reject) => {
                    try {
                        setData(prevData => {
                            const updatedData = [...prevData];
                            const index = updatedData.findIndex(item => item.address === address);
                            if (index === -1) {
                                const newEntry = {
                                    key: idCounter.toString(),
                                    address: address,
                                    result: "pending",
                                };
                                idCounter++;
                                updatedData.push(newEntry);
                            }
                            return updatedData;
                        });
                        const response = await getOtherData(address);
                        setData(prevData => {
                            const updatedData = [...prevData];
                            const index = updatedData.findIndex(item => item.address === address);
                            if (index !== -1) {
                                updatedData[index] = {
                                    ...updatedData[index],
                                    ...response,
                                };
                            }
                            return updatedData;
                        });
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
                promisesQueue.push(promiseFunction);
            }
            processQueue();
            while (activePromises > 0 || promisesQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            notification.success({
                message: "成功",
                description: "批量添加完成",
                duration: 1,
            })
        } catch (error) {
            notification.error({
                message: "错误",
                description: error.message,
                duration: 1,
            });
        } finally {
            batchForm.resetFields();
            setSelectedKeys([]);
            setBatchLoading(false)
        }
    };
    const handleRefresh = async (singleKey) => {
        const keys = singleKey ? [singleKey] : selectedKeys;
        if (!keys.length) {
            notification.error({
                message: "错误",
                description: "请先选择要刷新的地址",
                duration: 1,
            });
            return;
        }
        setIsLoading(true);
        try {
            const limit = 2;
            let activePromises = 0;
            let promisesQueue = [];
            const processQueue = () => {
                while (promisesQueue.length > 0 && activePromises < limit) {
                    const promise = promisesQueue.shift();
                    activePromises += 1;
                    promise().finally(() => {
                        activePromises -= 1;
                        processQueue();
                    });
                }
            };
            for (let key of keys) {
                const index = data.findIndex(item => item.key === key);
                if (index !== -1) {
                    const promiseFunction = () => new Promise(async (resolve, reject) => {
                        try {
                            setData(prevData => {
                                const updatedData = [...prevData];
                                for (let field in updatedData[index]) {
                                    if (field !== 'address' && field !== 'name' && field !== 'key') {
                                        if (field === "result") {
                                            updatedData[index][field] = "pending";
                                        } else {
                                            updatedData[index][field] = null;
                                        }
                                    }
                                }
                                return updatedData;
                            });

                            const response = await getOtherData(data[index].address);
                            setData(prevData => {
                                const updatedData = [...prevData];
                                updatedData[index] = {
                                    ...updatedData[index],
                                    ...response,
                                };
                                localStorage.setItem('Other_addresses', JSON.stringify(updatedData));
                                return updatedData;
                            });
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    });
                    promisesQueue.push(promiseFunction);
                }
            }
            processQueue();
            while (activePromises > 0 || promisesQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            notification.success({
                message: "完成",
                description: "刷新地址数据完成",
                duration: 1,
            });
        } catch (error) {
            notification.error({
                message: "错误",
                description: error.message,
                duration: 1,
            });
        } finally {
            setIsLoading(false);
            if (!singleKey) {
                setSelectedKeys([]);
            }
        }
    };

    const handleDeleteSelected = async () => {
        if (!selectedKeys.length) {
            notification.error({
                message: "错误",
                description: "请先选择要删除的地址",
                duration: 1,
            });
            return;
        }
        setData(data.filter(item => !selectedKeys.includes(item.key)));
        localStorage.setItem('Other_addresses', JSON.stringify(data.filter(item => !selectedKeys.includes(item.key))));
        setSelectedKeys([]);
    }
    const exportToExcelFile = () => {
        exportToExcel(data, 'OtherInfo');
    }
    const [editingKey, setEditingKey] = useState(null);
    const rowSelection = {
        selectedRowKeys: selectedKeys,
        onChange: (selectedRowKeys) => {
            setSelectedKeys(selectedRowKeys);
        },
    };
    return (
        <div>
            <Content>
                <Modal title="批量添加地址" open={isBatchModalVisible} onOk={handleBatchOk}
                       onCancel={() => {
                           setIsBatchModalVisible(false)
                           batchForm.resetFields()
                       }}
                       okText={"添加地址"}
                       cancelText={"取消"}
                       width={800}
                >
                    <Form form={batchForm} layout="vertical">
                        <Form.Item label="地址" name="addresses" rules={[
                            {
                                required: true,
                                validator: (_, value) => {
                                    const addresses = value.split("\n");
                                    let errorLines = [];
                                    for (let i = 0; i < addresses.length; i++) {
                                        let address = addresses[i].trim();
                                        if (!address.startsWith("0x") || (address.length !== 66 && address.length !== 42)) {
                                            errorLines.push(i + 1);
                                        }
                                    }
                                    if (errorLines.length) {
                                        return Promise.reject(`行 ${errorLines.join(", ")} 的地址格式错误，请输入正确的地址`);
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}>
                            <TextArea placeholder="请输入地址，每行一个"
                                      style={{width: "100%", height: "300px", resize: "none"}}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <div style={{marginBottom: "50px"}}>
                    <Spin spinning={tableLoading} size={"small"}>
                        <Table
                            rowSelection={rowSelection}
                            dataSource={data}
                            pagination={false}
                            bordered={true}
                            style={{marginBottom: "20px"}}
                            size={"small"}
                            columns={columns}
                        />
                    </Spin>
                </div>
                <div className="Other_footer">
                    <Card size={"small"} style={{width: "100%"}} align="center" >
                        <div style={{width: '80%', display: 'flex', justifyContent: 'space-between'}}>
                            <Button type="primary" onClick={() => {
                                setIsBatchModalVisible(true)
                            }} size={"large"} style={{width: "25%"}} icon={<UploadOutlined/>} loading={batchLoading}>
                                {batchLoading ? "添加中..." : "添加地址"}
                            </Button>
                            <Button type="primary" onClick={() => handleRefresh()} loading={isLoading} size={"large"}
                                    style={{width: "25%"}}
                                    icon={<SyncOutlined/>}>
                                刷新选中地址
                            </Button>
                            <Popconfirm title={"确认删除" + selectedKeys.length + "个地址？"}
                                        onConfirm={async () => {
                                            await handleDeleteSelected()
                                        }}>
                                <Button type="primary" danger size={"large"}
                                        style={{width: "25%"}}
                                        icon={<DeleteOutlined/>}>
                                    删除选中地址
                                </Button>
                            </Popconfirm>
                        </div>
                    </Card>
                </div>
            </Content>
        </div>
    )
}
export default Other;
