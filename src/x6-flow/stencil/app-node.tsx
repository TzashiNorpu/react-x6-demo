import { Node } from '@antv/x6'
import { register } from '@antv/x6-react-shape'
import { Dropdown } from 'antd'
import './index.less'


export const AppComponent = ({ node }: { node: Node }) => {
    const label = node.prop('label')
    return (
        <Dropdown
            menu={{
                items: [
                    {
                        key: 'copy',
                        label: '复制',
                    },
                    {
                        key: 'paste',
                        label: '粘贴',
                    },
                    {
                        key: 'delete',
                        label: '删除',
                    },
                ],
            }}
            trigger={['contextMenu']}
        >
            <div className="custom-react-node">{label}</div>
        </Dropdown>
    )
}

register({
    shape: 'app-react-node',
    component: AppComponent,
})

