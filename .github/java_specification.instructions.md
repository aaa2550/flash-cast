---
applyTo: "**/*.java"
---

# Project coding standards for Java

# 接口服务端代码开发规范手册

## 技术栈及版本

### 核心框架
- **Spring Boot**: 3.4.5
- **Spring Security**: 6.3.0
- **Spring Web**: 3.4.5
- **Spring AOP**: 3.4.5
- **Spring Validation**: 3.4.5

### 数据库相关
- **MyBatis-Flex**: 1.10.9 (ORM框架)
- **MySQL**: 8.0.33
- **Druid**: 1.2.25 (连接池)
- **Dynamic DataSource**: 4.3.1 (动态数据源)

### 安全认证
- **JWT**: 0.12.6 (JSON Web Token)
- **BCrypt**: 密码加密

### 工具库
- **Lombok**: 1.18.20 (代码生成)
- **Hutool**: 5.8.22 (工具类库)
- **MapStruct**: 1.5.5.Final (对象映射)
- **FastJSON2**: 2.0.57 (JSON处理)
- **Guava**: 31.1-jre (Google工具库)
- **Commons IO**: 2.19.0
- **Commons Text**: 1.9

### API文档
- **SpringDoc OpenAPI**: 2.8.9 (Swagger 3)

## 包结构规范

### 主要包结构
```
com.evolver.fabao/
├── common/           # 公共组件
├── config/           # 配置类
├── controller/       # 控制器层
├── convert/          # 对象转换器
├── dto/              # 数据传输对象
├── entity/           # 实体类
│   ├── fawn/        # fawn数据源实体
│   └── server/      # server数据源实体
├── enums/            # 枚举类
├── exception/        # 异常处理
├── filter/           # 过滤器
├── interceptor/      # 拦截器
├── mapper/           # MyBatis映射器
├── repository/       # 数据访问层
│   └── impl/        # 数据访问实现
├── service/          # 业务逻辑层
│   └── impl/        # 业务逻辑实现
├── utils/            # 工具类
└── StartApplication.java  # 启动类
```

### 包命名规范
- 使用小写字母，多个单词用点分隔
- 包名应该反映其功能职责
- 避免使用下划线或特殊字符

## 命名规范

### 类命名规范
- **实体类**: 使用 `DO` 后缀 (如: `AgentDO`, `UserDO`)
- **DTO类**: 直接使用业务名称 (如: `Agent`, `User`)
- **VO类**: 使用 `VO` 后缀 (如: `AgentVO`)
- **控制器**: 使用 `Controller` 后缀 (如: `AuthController`)
- **服务接口**: 使用 `Service` 后缀 (如: `AgentService`)
- **服务实现**: 使用 `ServiceImpl` 后缀 (如: `AgentServiceImpl`)
- **数据访问**: 使用 `Repository` 后缀 (如: `AgentRepository`)
- **数据访问实现**: 使用 `RepositoryImpl` 后缀 (如: `AgentRepositoryImpl`)
- **转换器**: 使用 `Converter` 后缀 (如: `AgentConverter`)
- **枚举**: 使用 `Enum` 后缀 (如: `ErrorCode`, `AuthStatus`)

### 方法命名规范
- **查询多条**: `find` (如: `findByCondition`, `findAll`)
- **查询单条**: `get` (如: `getById`, `getByCode`)
- **查询数量**: `count` (如: `countByCondition`)
- **保存方法**: `save`, `insert`, `create`
- **更新方法**: `update`, `modify`
- **删除方法**: `delete`, `remove`
- **业务方法**: 使用动词+名词形式 (如: `transfer`, `login`, `logout`)

### 变量命名规范
- 使用驼峰命名法 (camelCase)
- 常量使用全大写+下划线 (UPPER_SNAKE_CASE)
- 布尔类型变量使用 `is`, `has`, `can` 等前缀

### 数据库命名规范
- 表名使用下划线命名法 (snake_case)
- 字段名使用下划线命名法 (snake_case)
- 主键统一使用 `id`
- 外键使用 `表名_id` 格式

## 代码规范

### 注解使用规范
- **类级别注解**: `@Data`, `@RestController`, `@Service`, `@Repository`
- **方法级别注解**: `@Operation`, `@ApiResponses`, `@RequestMapping`
- **字段级别注解**: `@Schema`, `@Autowired`, `@Table`
- **转换**：所有DO转换必须在repository层完成，service层不允许出现DO类，

### 统一响应格式
```java
@Data
@Schema(description = "统一响应结果")
public class R<T> {
    @Schema(description = "响应码", example = "0")
    private Integer code;

    @Schema(description = "响应消息", example = "操作成功")
    private String message;

    @Schema(description = "响应数据")
    private T data;

    @Schema(description = "时间戳", example = "1640995200000")
    private Long timestamp;
}
```

### 异常处理规范
- 使用自定义异常类 `EvoCourseException`
- 统一异常翻译器 `RestExceptionTranslator`
- 错误码使用枚举 `ErrorCode`

### 日志规范
- 使用 `@Slf4j` 注解
- 日志级别: `info`, `debug`, `warn`, `error`
- 关键业务操作必须记录日志

### 安全规范
- 使用Spring Security进行认证授权
- JWT Token认证
- 密码使用BCrypt加密
- 敏感信息不在日志中输出

## 数据库规范

### Mapper层规范
- **继承BaseMapper**: 所有Mapper接口必须继承 `BaseMapper<EntityDO>`
- **使用@Mapper注解**: 类级别添加 `@Mapper` 注解
- **禁止自定义SQL**: 不编写自定义SQL语句，使用MyBatis-Flex提供的方法
- **示例**:
```java
@Mapper
public interface AgentMapper extends BaseMapper<AgentDO> {
}
```

### Repository层规范
- **继承IService**: 所有Repository接口必须继承 `IService<EntityDO>`
- **使用转换器**: 引入对应的Converter进行DO与DTO转换
- **方法命名**: 遵循find(查多条)、get(查单条)、count(查数量)规范
- **链式调用**: 优先使用queryChain()和updateChain()方法
- **示例**:
```java
public interface AgentRepository extends IService<AgentDO> {
    AgentConverter INSTANCE = Mappers.getMapper(AgentConverter.class);

    List<Agent> find(List<String> agentNames, Integer agentModelId);
    Agent get(Long id);
    Long count(StageType stageType);
}
```

### Convert层规范
- **使用MapStruct**: 所有转换器使用MapStruct框架
- **继承Mapper**: 使用 `@Mapper` 注解，继承 `Mapper` 接口
- **必须的转换方法**:
  - `convertToDTO(EntityDO obj)` - 单个DO转DTO
  - `convertToDTO(List<EntityDO> list)` - 列表DO转DTO
  - `convertToDTO(Page<EntityDO> page)` - 分页DO转DTO
  - `convertToDO(Entity obj)` - 单个DTO转DO
  - `convertToDO(List<Entity> list)` - 列表DTO转DO
- **方法命名规范**: 统一使用 `convertToDTO` 和 `convertToDO` 方法名
- **示例**:
```java
@Mapper
public interface UserConverter {
    UserConverter INSTANCE = Mappers.getMapper(UserConverter.class);

    User convertToDTO(UserDO obj);
    List<User> convertToDTO(List<UserDO> list);
    Page<User> convertToDTO(Page<UserDO> page);
    UserDO convertToDO(User obj);
    List<UserDO> convertToDO(List<User> list);
}
```

### 连接池配置
```yaml
druid:
  initial-size: 5
  min-idle: 5
  max-active: 20
  max-wait: 60000
  validation-query: SELECT 1
  test-while-idle: true
```

### MyBatis配置
- 开启下划线转驼峰: `map-underscore-to-camel-case: true`
- 使用MyBatis-Flex进行ORM映射
- 实体类使用 `@Table` 注解指定表名和数据源
- **禁止使用XML映射文件**，所有SQL操作通过代码实现
- **避免连表查询**，优先使用单表查询+业务层组装
- **优先使用IService的queryChain()和updateChain()方法**

### SQL查询规范
- **禁止原生SQL**: 不允许使用 `@Select`, `@Update` 等原生SQL注解
- **使用链式调用**: 优先使用 `queryChain()` 和 `updateChain()` 方法
- **避免连表查询**: 复杂查询拆分为多个单表查询，在业务层组装
- **分页查询**: 使用 `Page<T>` 对象进行分页
- **条件查询**: 使用 `QueryWrapper` 构建查询条件
- **示例**:
```java
#### 推荐：使用链式调用
List<AgentDO> agents = queryChain()
    .select(AgentDO::getId, AgentDO::getCustomerName)
    .where(AgentDO::getAgentModelId).eq(agentModelId)
    .list();

#### 避免：原生SQL
@Select("SELECT * FROM agent WHERE agent_model_id = #{agentModelId}")
List<AgentDO> findByAgentModelId(Integer agentModelId);
```

## API文档规范

### Swagger注解使用
- **控制器**: `@Tag` 描述接口分组
- **方法**: `@Operation` 描述接口功能
- **参数**: `@Parameter` 描述参数
- **响应**: `@ApiResponses` 描述响应格式
- **模型**: `@Schema` 描述数据结构

### 接口路径规范
- RESTful风格
- 使用名词复数形式
- 版本控制: `/api/v1/`
- 认证相关: `/auth/`

## 开发环境配置

### 应用配置
```yaml
server:
  port: 8080

spring:
  application:
    name: evo-console-hub

# JWT配置
app:
  jwt:
    secret: your-secret-key
    expiration: 86400000  # 24小时
```

### 日志配置
- 使用logback-spring.xml
- 按包级别配置日志
- 生产环境使用文件输出

## 构建部署规范

### Maven配置
- 使用Spring Boot Maven Plugin
- Java版本: 17
- 编码: UTF-8
- 编译插件: maven-compiler-plugin 3.11.0

### 打包规范
- 使用Spring Boot可执行JAR
- 包含所有依赖
- 配置文件外部化

## 代码质量规范

### 代码审查要点
1. **命名规范**: 类名、方法名、变量名是否符合规范
2. **注释规范**: 类、方法、复杂逻辑是否有注释
3. **异常处理**: 是否合理处理异常
4. **日志记录**: 关键操作是否记录日志
5. **安全考虑**: 敏感信息是否泄露
6. **性能考虑**: 是否有性能问题
7. **SQL规范**: 是否避免连表查询，是否使用MyBatis-Flex链式调用

## 版本控制规范

### Git提交规范
- 使用语义化提交信息
- 格式: `type(scope): description`
- 类型: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### 分支管理
- `main`: 主分支，生产环境代码
- `develop`: 开发分支
- `feature/*`: 功能分支
- `hotfix/*`: 热修复分支

## 部署规范

### 环境配置
- **开发环境**: 本地开发
- **测试环境**: 功能测试
- **生产环境**: 正式部署

### 监控规范
- 应用健康检查: `/actuator/health`
- 性能监控: JVM指标
- 业务监控: 关键业务指标

---

**注意**: 本规范文档应随项目发展持续更新，确保团队成员遵循统一的开发标准。 