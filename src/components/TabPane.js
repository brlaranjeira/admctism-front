import React, {Component} from 'react';
import Tab from './Tab';

class TabPane extends Component {

    render () {
        const tabList = this.props.children.filter( (vl) => vl.type.name === Tab.name ).map( ( vl , idx ) => {
            //return <span> Tab: {vl.props.title} #{vl.props.id}  </span>;
            //const ariaSelected = idx === 0 ? 'true' : 'false';
            const cls = idx === 0 ? 'nav-link active' : 'nav-link';
            return <li className={"nav-item"}>
                <a id={vl.props.id+'-tab'} data-toggle="tab" aria-controls={vl.props.id} className={cls} href={'#'+vl.props.id}>
                    {vl.props.title}
                </a>
            </li>;
        } );
        const tabsHeader = <ul className={'nav nav-tabs'} id={this.props.id} role={'tablist'} >{tabList}</ul>;
        const contentsList = this.props.children.filter( (vl) => vl.type.name === Tab.name ).map( ( vl , idx ) => {
            const cl = idx === 0 ? 'tab-pane show active' : 'tab-pane show';
            return <div className={cl} id={vl.props.id} role={'tabpanel'} aria-labelledby={vl.props.id+'-tab'}>
                {vl}
            </div>;
        } );
        const tabsContent = <div id={this.props.id + '-content'} className={'tab-content'}>{contentsList}</div>;
        return <section>
            {tabsHeader}
            {tabsContent}
        </section>;
    }
}
export default TabPane;