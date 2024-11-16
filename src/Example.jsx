import styles from "./example.module.css";

export default function Example() {
    return (
        // main container
        <div className={styles.sample}>
            {/* header */}
          <div className="header-mark">LOGO</div>
          {/* main content contair */}
          <div className="main-content-mark">
            {/* navbar */}
            <div className="navi-mark">
    <p>i am link 1</p>
    <p>i am link 2</p>
    <p>i am link 3</p>
    <p>i am link 4</p>
            </div>
            {/* 2nd content */}
            <div>
            {/* name header */}
            <div>HELLO WORLD</div>
            {/*MAIL*/}
            <div>MAIL</div>
            </div>
          </div>
        </div>
    );
}