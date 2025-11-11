import pc from 'picocolors';

export const logger = {
  info: (text) => console.log(pc.blue('ℹ') + ' ' + text),
  success: (text) => console.log(pc.green('✅') + ' ' + text),
  error: (text) => console.log(pc.red('❌') + ' ' + text),
  warning: (text) => console.log(pc.yellow('⚠️') + ' ' + text),
  file: (text) => console.log(pc.gray('📄') + ' ' + text),
  command: (text) => console.log(pc.cyan('➜') + ' ' + pc.bold(text)),
  
  header: (text) => {
    console.log(pc.bold(pc.blue('\n🚀 ' + text + '\n')));
  },
  
  section: (text) => {
    console.log(pc.bold(pc.cyan('\n' + text)));
    console.log(pc.cyan('─'.repeat(text.length)));
  }
};
